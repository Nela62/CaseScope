import { NonRetriableError, referenceFunction } from "inngest";
import { inngest } from "./client";
import { Bedrock } from "@llamaindex/community";
import { LlamaParseReader } from "llamaindex";
import { serviceClient } from "@/lib/supabase/service";
import { getExtractor } from "@/lib/extractors";
import { ExtractorType } from "@/types/extractor";

export const extractData = inngest.createFunction(
  { id: "extract-data" },
  { event: "api/document.extracted" },
  async ({ event, step }) => {
    const { text, extractor } = await step.run("init", async () => {
      const { text, extractor } = event.data;

      if (!text || !extractor) {
        throw new NonRetriableError("Missing required data", {
          cause: { text, extractor },
        });
      }
      return { text, extractor };
    });

    const llm = new Bedrock({
      model: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      region: "us-west-2",
      maxTokens: 2048,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const prompt = extractor.promptTemplate
      .replace("{{TEXT}}", text)
      .replace("{{JSON_SCHEMA}}", JSON.stringify(extractor.jsonSchema));

    const { text: response } = await step.run("extract-data", async () => {
      // TODO: add retry-after on rate limit error
      return llm.complete({ prompt });
    });

    const extractedData = await step.run("parse-extracted-data", async () => {
      try {
        const extractedDataMatch = response.match(
          /<extracted_data>([\s\S]*?)<\/extracted_data>/
        );
        return JSON.parse(extractedDataMatch?.[1] ?? "{}");
      } catch (error) {
        throw new NonRetriableError(
          "Failed to parse extracted data: " + (error as Error).message,
          {
            cause: error,
          }
        );
      }
    });

    return { data: extractedData };
  }
);

const extractDataFn = referenceFunction<typeof extractData>({
  functionId: "extract-data",
});

// TODO: when the run fails, it should delete the document row from the db, the file from the storage, and any stored extracted data

export const processNewDocument = inngest.createFunction(
  { id: "process-new-document" },
  { event: "api/document.added" },
  async ({ event, step }) => {
    const { fileName, fileId, userId } = event.data;

    const text = await step.run("parse-document", async () => {
      // Download the file
      const supabase = serviceClient();
      const { data, error } = await supabase.storage
        .from("documents")
        .download(`${userId}/${fileName}`);

      if (error) {
        throw new NonRetriableError(
          "Failed to download file: " + error.message,
          {
            cause: error,
          }
        );
      }

      // Parse the document
      // const { LlamaParseReader } = await import("llamaindex");

      const arrayBuffer = await data.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const reader = new LlamaParseReader({ resultType: "markdown" });

      const documents = await reader.loadDataAsContent(bytes, fileName);

      const text = documents.reduce((acc, doc) => acc + doc.text, "");

      return text;
    });

    const caseDetailsExtractor = getExtractor(ExtractorType.CASE_DETAILS);
    const issuesExtractor = getExtractor(ExtractorType.TENANT_ISSUES);

    const caseDetailsRes = await step.invoke("extract-case-details", {
      function: extractDataFn,
      data: { text, extractor: caseDetailsExtractor },
    });

    const caseDetails = caseDetailsRes.data;

    const issuesRes = await step.invoke("extract-issues", {
      function: extractDataFn,
      data: { text, extractor: issuesExtractor },
    });

    const issues = issuesRes.data;

    // TODO: add validation

    await step.run("store-in-db", async () => {
      const supabase = serviceClient();
      const { data: caseData, error: caseError } = await supabase
        .from("hearing_cases")
        .insert({
          user_id: userId,
          document_id: fileId,
          case_numbers: caseDetails.caseNumbers,
          decision: caseDetails.decision,
          hearing_dates: caseDetails.hearingDates,
          hearing_officer: caseDetails.hearingOfficer,
          landlord_name: caseDetails.landlordName,
          length_of_tenancy: caseDetails.lengthOfTenancy,
          property_address: caseDetails.propertyAddress,
          reasoning: caseDetails.reasoning,
          total_relief_granted: caseDetails.totalReliefGranted,
        })
        .select("id")
        .single();

      if (caseError || !caseData) {
        throw new NonRetriableError(
          "Failed to store case in db: " + caseError?.message,
          {
            cause: caseError,
          }
        );
      }

      const caseId = caseData.id;

      const { error: issuesError } = await supabase.from("issues").insert({
        case_id: caseId,
        user_id: userId,
        document_id: fileId,
        category: issues.category,
        name: issues.name,
        issue_details: issues.issueDetails,
        duration: issues.duration,
        tenant_evidence: issues.tenantEvidence,
        landlord_counterarguments: issues.landlordCounterarguments,
        landlord_evidence: issues.landlordEvidence,
        decision: issues.decision,
        relief_granted: issues.reliefGranted,
        relief_description: issues.reliefDescription,
        relief_amount: Number(issues.reliefAmount) ?? null,
        relief_reason: issues.reliefReason,
      });

      if (issuesError) {
        throw new NonRetriableError(
          "Failed to store issues in db: " + issuesError.message,
          {
            cause: issuesError,
          }
        );
      }
    });

    return;
  }
);
