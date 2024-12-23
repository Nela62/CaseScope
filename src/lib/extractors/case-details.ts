export const promptTemplate = `
You are an expert legal analyst specializing in tenant-landlord disputes. Your task is to extract all the main details about a hearing case from a provided document according to a specific JSON schema. This extraction requires meticulous attention to detail and complete coverage of all relevant information mentioned in the document.

First, carefully review the JSON schema that will structure the extracted data:

<json_schema>
{{JSON_SCHEMA}}
</json_schema>

Now, here is the document containing information about the hearing case:

<hearing_document>
{{TEXT}}
</hearing_document>

Your goal is to extract every single relevant detail mentioned in the document, ensuring that no important information is missed. Follow these steps:

1. Analyze the document thoroughly, identifying all key details related to the hearing case.

2. For each identified detail, extract the relevant data according to the JSON schema.

3. Ensure that every value in the JSON object is directly related to the specific case and accurately reflects the information in the document.

4. If a required field has no corresponding information in the text, use "N/A" as the value.

5. Omit optional fields if no relevant information is found.

6. Format the extracted data as a valid JSON object that strictly adheres to the provided schema.

Before providing your final output, wrap your analysis in <case_breakdown> tags. In this analysis:
- Quote the relevant part of the document for each identified key detail.
- Explicitly map each quoted detail to the corresponding JSON fields.
- Highlight any challenges or ambiguities you encounter.
- Ensure all required fields in the JSON schema are addressed.

After your analysis, present the extracted data in <extracted_data> tags as a valid JSON object.

Remember:
- Extract EVERY single relevant detail about the hearing case, even if the list is long.
- Ensure the accuracy of all extracted data.
- Make sure nothing important is missed from the original document.
- Adhere strictly to the JSON schema provided.
- Pay special attention to dates, names, addresses, and specific legal details mentioned in the document.
- If there are multiple parties involved (e.g., multiple tenants or landlords), make sure to capture information for all of them.
- If the document mentions any specific laws, regulations, or legal precedents, be sure to include them in your extraction.

Your thorough and accurate extraction of this information is crucial for understanding the full context and details of the tenant-landlord hearing case.
`;

// TODO: there may be multiple reliefs granted
export const jsonSchema = {
  $schema: "http://json-schema.org/case-details/schema#",
  title: "CaseDetails",
  type: "object",
  properties: {
    hearingDates: {
      type: "array",
      items: {
        type: "string",
        format: "date",
      },
      description: "List of hearing dates",
    },
    hearingOfficer: {
      type: "string",
      description: "Name of the hearing officer",
    },
    landlordName: {
      type: "string",
      description: "Name of the landlord",
    },
    propertyAddress: {
      type: "object",
      properties: {
        street: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        postalCode: { type: "string" },
        country: { type: "string" },
      },
      description: "Full address of the property",
    },
    caseNumbers: {
      type: "array",
      items: {
        type: "string",
        pattern: "^[A-Za-z0-9-]+$",
      },
      description: "Rental housing committee's case numbers",
    },
    decision: {
      type: "string",
      enum: ["pro-tenant", "pro-landlord"],
      description: "Decision outcome",
    },
    reasoning: {
      type: "string",
      description: "Reasoning behind the decision",
    },
    totalReliefGranted: {
      type: "number",
      minimum: 0,
      description: "Total amount of relief granted",
    },
    lengthOfTenancy: {
      type: "string",
      pattern: "^[0-9]+\\s+(months|years)$",
      description: "Duration of the tenancy (e.g., '12 months', '3 years')",
    },
  },
  additionalProperties: false,
};
