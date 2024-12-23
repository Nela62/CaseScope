export const promptTemplate = `
You are an expert data analyst specializing in real estate and property management. Your task is to extract tenant issues from a provided document according to a specific JSON schema. This extraction requires meticulous attention to detail and complete coverage of all issues mentioned in the document.

First, carefully review the JSON schema that will structure the extracted data:

<json_schema>
{{JSON_SCHEMA}}
</json_schema>

Now, here is the document containing information about tenant issues:

<text>
{{TEXT}}
</text>

Your goal is to extract every single tenant issue mentioned in the document, ensuring that no information is missed. Follow these steps:

1. Analyze the document thoroughly, identifying all mentions of tenant issues.

2. For each identified issue, extract the relevant data according to the JSON schema.

3. Ensure that every value in each issue object is directly related to that specific issue.

4. If a required field has no corresponding information in the text, use "N/A" as the value.

5. Omit optional fields if no relevant information is found.

6. Format the extracted data as a valid JSON object that strictly adheres to the provided schema.

Before providing your final output, wrap your analysis in <issue_breakdown> tags. In this analysis:
- Quote the relevant part of the document for each identified tenant issue.
- Explicitly map each quoted issue to the corresponding JSON fields.
- Count the number of issues identified to ensure completeness.
- Highlight any challenges or ambiguities you encounter.

After your analysis, present the extracted data in <extracted_data> tags as a valid JSON object.

Remember:
- Extract EVERY single tenant issue, even if the list is long.
- Ensure the accuracy of all extracted data.
- Make sure nothing is missed from the original document.
- Adhere strictly to the JSON schema provided.
`;

export const jsonSchema = {
  $schema: "http://json-schema.org/list-of-issues/schema#",
  title: "IssuesList",
  type: "array",
  items: {
    type: "object",
    properties: {
      category: {
        type: "string",
        enum: [
          "illegal rent increase",
          "habitability",
          "maintenance",
          "code violations",
          "loss of or reduced housing services",
          "other",
        ],
        description: "Category of the tenant issue.",
      },
      name: {
        type: "string",
        description: "Short name or title of the tenant issue.",
      },
      issueDetails: {
        type: "string",
        description:
          "Detailed explanation of the issue, including specific landlord actions or housing condition problems (e.g., 'Landlord increased rent by 15% without proper notice' or 'Visible mold on the walls in the living room').",
      },
      duration: {
        type: ["string", "null"],
        description: "Duration related to the tenant issue, if applicable.",
      },
      tenantEvidence: {
        type: "array",
        items: {
          type: "string",
          description:
            "Evidence provided by the tenant supporting their claim.",
        },
        description:
          "List of evidence provided by the tenant supporting their claim. Ensure all evidence directly relates to the landlord's actions or housing conditions in question.",
      },
      landlordCounterarguments: {
        type: "array",
        items: {
          type: "string",
          description:
            "Counterarguments provided by the landlord in response to the tenant's claims.",
        },
        description:
          "List of counterarguments provided by the landlord in response to the tenant's claims. Should directly address the tenant's allegations.",
      },
      landlordEvidence: {
        type: "array",
        items: {
          type: "string",
          description:
            "Evidence provided by the landlord to support their position or actions.",
        },
        description:
          "List of evidence provided by the landlord to support their position or actions. Ensure all evidence directly relates to the landlord's side of the issue.",
      },
      decision: {
        type: "string",
        enum: ["pro-tenant", "pro-landlord", "neutral"],
        description: "Decision outcome of the issue.",
      },
      reliefGranted: {
        type: "boolean",
        description: "Indicates whether relief for the issue was granted.",
      },
      reliefDescription: {
        type: ["string", "null"],
        description:
          "Description of the relief granted for this specific issue, if any.",
      },
      reliefAmount: {
        type: ["number", "null"],
        description:
          "Amount of relief granted for this specific issue, if applicable.",
      },
      reliefReason: {
        type: ["string", "null"],
        description:
          "Reason for the relief granted for this specific issue, if any.",
      },
    },
    additionalProperties: false,
  },
};
