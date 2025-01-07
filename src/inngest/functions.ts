import { NonRetriableError, RetryAfterError } from "inngest";
import { inngest } from "./client";
import { Bedrock } from "@llamaindex/community";
import { LlamaParseReader } from "llamaindex";
import { serviceClient } from "@/lib/supabase/service";
import { getExtractor } from "@/lib/extractors";
import { Extractor, ExtractorType } from "@/types/extractor";
import { ThrottlingException } from "@aws-sdk/client-bedrock-runtime";
import { logToAthina } from "@/lib/utils";

// TODO: High: Rate limit exceeded error - still not good enough throttling
// TODO: High: When fails, it should delete or the user can't reupload

const extractData = async (text: string, extractor: Extractor) => {
  const llm = new Bedrock({
    model: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    region: "us-west-2",
    maxTokens: 8192,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const prompt = extractor.promptTemplate
    .replace("{{TEXT}}", text)
    .replace("{{JSON_SCHEMA}}", JSON.stringify(extractor.jsonSchema));

  try {
    const { text: response } = await llm.complete({ prompt });

    try {
      await logToAthina({
        promptSlug: `extract-data-${extractor.name}`,
        prompt: [
          // {
          //   role: "system",
          //   content:
          //     "You are an expert at answering questions about the world.",
          // },
          {
            role: "user",
            content: prompt,
          },
        ],
        response: response,
        languageModelId: "claude-3-5-sonnet-20241022",
      });
    } catch (error) {
      console.log("error", error);
    }

    try {
      const extractedDataMatch = response.match(
        /<extracted_data>([\s\S]*?)<\/extracted_data>/
      );
      const extractedData = JSON.parse(extractedDataMatch?.[1] ?? "{}");

      return extractedData;
    } catch (error) {
      throw new NonRetriableError(
        "Failed to parse extracted data: " + (error as Error).message,
        {
          cause: error,
        }
      );
    }
  } catch (error) {
    console.log("error", error);
    if (error instanceof ThrottlingException) {
      throw new RetryAfterError(
        "Rate limit exceeded: " + (error as Error).message,
        30000,
        {
          cause: error,
        }
      );
    }
  }
};

// export const extractData = inngest.createFunction(
//   { id: "extract-data" },
//   { event: "api/document.extracted" },
//   async ({ event, step }) => {
//     const { text, extractor } = await step.run("init", async () => {
//       const { text, extractor } = event.data;

//       if (!text || !extractor) {
//         throw new NonRetriableError("Missing required data", {
//           cause: { text, extractor },
//         });
//       }
//       return { text, extractor };
//     });

//     const llm = new Bedrock({
//       model: "anthropic.claude-3-5-sonnet-20241022-v2:0",
//       region: "us-west-2",
//       maxTokens: 2048,
//       credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//       },
//     });

//     const prompt = extractor.promptTemplate
//       .replace("{{TEXT}}", text)
//       .replace("{{JSON_SCHEMA}}", JSON.stringify(extractor.jsonSchema));

//     const { text: response } = await step.run("extract-data", async () => {
//
//       return llm.complete({ prompt });
//     });

//     const extractedData = await step.run("parse-extracted-data", async () => {
//       try {
//         const extractedDataMatch = response.match(
//           /<extracted_data>([\s\S]*?)<\/extracted_data>/
//         );
//         return JSON.parse(extractedDataMatch?.[1] ?? "{}");
//       } catch (error) {
//         throw new NonRetriableError(
//           "Failed to parse extracted data: " + (error as Error).message,
//           {
//             cause: error,
//           }
//         );
//       }
//     });

//     return { data: extractedData };
//   }
// );

// const extractDataFn = referenceFunction<typeof extractData>({
//   functionId: "extract-data",
// });

// TODO: Low: when the run fails, it should delete the document row from the db, the file from the storage, and any stored extracted data

export const processNewDocument = inngest.createFunction(
  { id: "process-new-document" },
  { event: "api/document.added" },
  async ({ event, step }) => {
    const { fileName, userId } = event.data;
    const supabase = serviceClient();

    const fileId = await step.run("store-document-in-db", async () => {
      const { data, error } = await supabase
        .from("documents")
        .insert({
          user_id: userId,
          name: fileName,
        })
        .select("id")
        .single();

      if (error || !data) {
        throw new NonRetriableError(
          "Failed to store document in db: " + error?.message,
          {
            cause: error,
          }
        );
      }

      return data.id;
    });

    const text = await step.run("parse-document", async () => {
      // Download the file
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

    await step.run("store-text", async () => {
      const mdFileName = fileName.replace(".pdf", ".md");
      const { error: textError } = await supabase.storage
        .from("documents")
        .upload(`${userId}/${mdFileName}`, text);

      if (textError) {
        throw new NonRetriableError(
          "Failed to store text in db: " + textError.message,
          {
            cause: textError,
          }
        );
      }
    });

    // TODO: Low: Add a list of already existing landlords

    const caseId = await step.run("extract-case-details", async () => {
      const caseDetailsExtractor = getExtractor(ExtractorType.CASE_DETAILS);
      const caseDetails = await extractData(text, caseDetailsExtractor);

      // TODO: High: Add json parsing with retry on fail
      try {
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

        return caseId;
      } catch (err) {
        throw new NonRetriableError(
          "Failed to store case in db: " +
            (err as Error).message +
            ". Extracted data: " +
            JSON.stringify(caseDetails),
          {
            cause: err,
          }
        );
      }
    });

    await step.run("extract-tenant-issues", async () => {
      const issuesExtractor = getExtractor(ExtractorType.TENANT_ISSUES);
      const issuesRes = await extractData(text, issuesExtractor);

      if (Object.keys(issuesRes).length === 0) {
        throw new NonRetriableError(
          "Failed to extract tenant issues. LLM response: " +
            JSON.stringify(issuesExtractor),
          {
            cause: issuesRes,
          }
        );
      }

      const issues = "issues" in issuesRes ? issuesRes.issues : issuesRes;

      try {
        // TODO: High: Add json parsing with retry on fail
        const { error: issuesError } = await supabase.from("issues").insert(
          // @ts-expect-error for later
          issues.map((issue) => ({
            case_id: caseId,
            user_id: userId,
            document_id: fileId,
            category: issue.category,
            subcategory: issue.subcategory,
            issue_type: issue.issueType,
            issue_details: issue.issueDetails,
            duration: issue.duration,
            tenant_evidence: issue.tenantEvidence,
            tenant_citations: issue.tenantCitations,
            landlord_response: issue.landlordResponse,
            landlord_citations: issue.landlordCitations,
            landlord_evidence: issue.landlordEvidence,
            decision: issue.decision,
            relief_granted: issue.reliefGranted,
            relief_description: issue.reliefDescription,
            relief_amount: isNaN(Number(issue.reliefAmount))
              ? null
              : Number(issue.reliefAmount),
            relief_reason: issue.reliefReason,
          }))
        );

        if (issuesError) {
          throw new NonRetriableError(
            "Failed to store issues in db: " +
              issuesError.message +
              ". Extracted data: " +
              JSON.stringify(issuesRes),
            {
              cause: issuesError,
            }
          );
        }
      } catch (err) {
        throw new NonRetriableError(
          "Failed to store issues in db: " +
            (err as Error).message +
            ". Extracted data: " +
            JSON.stringify(issuesRes),
          {
            cause: err,
          }
        );
      }
    });

    return;
  }
);
