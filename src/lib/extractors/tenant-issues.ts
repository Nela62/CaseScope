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

// TODO: Low: Improve duration
const ISSUES = [
  {
    category: "habitability issues",
    subcategories: [
      {
        subcategory: "waterproofing and weather protection",
        issueTypes: [
          "ineffective waterproofing causing wet or moldy walls",
          "inadequate weather protection for roofs, walls, or ceilings",
        ],
      },
      {
        subcategory: "plumbing and water issues",
        issueTypes: [
          "defective plumbing, drains, toilet facilities, and sewage systems",
          "recurring water leaks from ceilings, walls, or pipes",
          "insufficient water or hot water supply",
          "cloudy or discolored water from taps",
        ],
      },
      {
        subcategory: "heating and gas problems",
        issueTypes: [
          "malfunctioning heaters during cold weather",
          "defective or broken heater or gas facilities",
          "unsafe or leaking gas appliances",
        ],
      },
      {
        subcategory: "electrical and lighting issues",
        issueTypes: [
          "unsafe or inoperative electrical wiring",
          "inoperative lighting in units or common areas",
        ],
      },
      {
        subcategory: "structural and safety concerns",
        issueTypes: [
          "cracked, broken, or rotting floors, stairs, railings, and balconies",
          "loose or broken windowpanes and doors",
        ],
      },
      {
        subcategory: "pest control and sanitation",
        issueTypes: [
          "recurring infestations of pests (e.g., ants, cockroaches, rodents)",
          "unsanitary conditions in shared spaces, such as trash accumulation or animal waste",
          "overflowing trash bins",
        ],
      },
      {
        subcategory: "ventilation problems",
        issueTypes: ["inadequate ventilation causing condensation and mold"],
      },
      {
        subcategory: "noise complaints",
        issueTypes: [
          "persistent noise disturbances from neighboring units or external sources",
        ],
      },
      {
        subcategory: "delayed or inadequate repairs",
        issueTypes: [
          "prolonged delays in fixing reported issues",
          "temporary fixes, such as duct tape or tarps, instead of permanent solutions",
        ],
      },
      {
        subcategory: "appliance failures",
        issueTypes: ["non-functional appliances provided by the landlord"],
      },
      {
        subcategory: "paint, flooring, and fixtures",
        issueTypes: [
          "peeling, crumbling, or stained paint and wall coverings",
          "carpets with holes, cracks, or disintegrating material",
          "missing or cracked tiles and deteriorated flooring",
          "damaged countertops, cabinets, and drawers",
        ],
      },
    ],
  },
  {
    category: "service and amenity reductions",
    subcategories: [
      {
        subcategory: "restricted amenities",
        issueTypes: [
          "closure or neglect of recreational facilities",
          "reduced access to storage spaces, laundry facilities, or parking",
          "defective or inoperative elevators",
          "broken or missing mailboxes",
          "lack of landscaping or yard-care services",
        ],
      },
      {
        subcategory: "security issues",
        issueTypes: [
          "broken or defective security gates, intercoms, doors, fencing, or exterior lights",
          "unsecured common areas",
        ],
      },
      {
        subcategory: "on-site management",
        issueTypes: [
          "lack of required on-site resident manager services",
          "ineffective tenant communication portals for reporting issues",
        ],
      },
    ],
  },
  {
    category: "violation of tenant rights",
    subcategories: [
      {
        subcategory: "illegal entry",
        issueTypes: [
          "entering the property without proper notice or tenant consent",
        ],
      },
      {
        subcategory: "privacy violations",
        issueTypes: [
          "installing surveillance equipment without tenant knowledge or consent",
        ],
      },
      {
        subcategory: "discrimination",
        issueTypes: [
          "refusing to rent based on protected characteristics (race, religion, gender, etc.)",
          "providing different terms or conditions based on protected characteristics",
          "steering tenants to particular buildings or neighborhoods based on protected characteristics",
        ],
      },
      {
        subcategory: "retaliation",
        issueTypes: [
          "evicting tenants for exercising their legal rights",
          "increasing rent or reducing services in response to complaints",
        ],
      },
      {
        subcategory: "harassment",
        issueTypes: [
          "verbal or physical intimidation of tenants",
          "excessive or unwarranted communications",
        ],
      },
    ],
  },
  {
    category: "financial and contractual violations",
    subcategories: [
      {
        subcategory: "unlawful rent adjustments",
        issueTypes: [
          "improper, sudden, or unnotified rent increases",
          "rent increases during unresolved habitability issues",
          "failure to roll back rents as required by local ordinances",
          "back-charging for rent discounts or concessions",
        ],
      },
      {
        subcategory: "security deposit mishandling",
        issueTypes: [
          "failure to return deposits within legal timeframes",
          "improper deductions from security deposits",
        ],
      },
      {
        subcategory: "unlawful utility charges",
        issueTypes: [
          "overcharging for utilities",
          "charging unauthorized utility fees or insurance costs",
        ],
      },
      {
        subcategory: "lease violations",
        issueTypes: [
          "changing lease terms without mutual agreement",
          "enforcing illegal lease clauses",
        ],
      },
    ],
  },
  {
    category: "eviction-related violations",
    subcategories: [
      {
        subcategory: "wrongful eviction",
        issueTypes: [
          "evicting without proper cause in areas with just-cause eviction laws",
          "improper owner move-in evictions violating local ordinances",
          "retaliatory evictions",
        ],
      },
      {
        subcategory: "illegal lockouts",
        issueTypes: [
          "changing locks without following proper eviction procedures",
        ],
      },
      {
        subcategory: "utility shutoffs",
        issueTypes: ["turning off utilities to force tenants to leave"],
      },
    ],
  },
  {
    category: "fair housing act violations",
    subcategories: [
      {
        subcategory: "discriminatory practices",
        issueTypes: [
          "making discriminatory statements or advertisements",
          "using different qualification criteria based on protected characteristics",
          "refusing to make reasonable accommodations for disabled tenants",
        ],
      },
      {
        subcategory: "steering",
        issueTypes: [
          "discouraging purchase or rental in certain neighborhoods based on protected characteristics",
        ],
      },
    ],
  },
];

export const jsonSchema = {
  $schema: "http://json-schema.org/list-of-issues/schema#",
  title: "IssuesList",
  type: "array",
  items: {
    type: "object",
    properties: {
      category: {
        type: "string",
        enum: ISSUES.map((issue) => issue.category),
      },
      allOf: ISSUES.map((issue) => ({
        if: {
          properties: { category: { const: issue.category } },
        },
        then: {
          properties: {
            subcategory: {
              enum: issue.subcategories.map(
                (subcategory) => subcategory.subcategory
              ),
              allOf: issue.subcategories.map((subcategory) => ({
                if: {
                  properties: {
                    subcategory: { const: subcategory.subcategory },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: subcategory.issueTypes,
                    },
                  },
                },
              })),
            },
          },
        },
      })),
      tenantCitations: {
        type: "array",
        items: {
          type: "string",
          description:
            "A citation that is directly related to the tenant's issue. It can be truncated.",
        },
        description:
          "List of citations from the hearing describing the tenant's issue in detail.",
      },
      issueDetails: {
        type: "string",
        description:
          "Short but detailed explanation of the issue that includes specific landlord actions or housing condition problems (e.g., 'Landlord increased rent by 15% without proper notice' or 'Visible mold on the walls in the living room'). Based on the tenant's citations.",
      },
      duration: {
        type: ["string", "null"],
        description: "Duration related to the tenant issue, if applicable",
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
      landlordResponse: {
        type: "array",
        items: {
          type: "string",
          description:
            "The response given by the landlord in response to the tenant's issue.",
        },
        description:
          "List of responses given by the landlord in response to the tenant's issue. Should directly address the tenant's issue.",
      },
      landlordCitations: {
        type: "array",
        items: {
          type: "string",
          description:
            "A citation that is directly related to the landlord's response to the tenant's issue. It can be truncated.",
        },
        description:
          "List of citations from the hearing describing the landlord's response to the tenant's issue in detail.",
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
