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

// TODO: Medium: Change landlord counter_arguments to landlord_response

// TODO: Low: Shorten the issue names
// TODO: Low: Improve duration
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
          "habitability problems",
          "maintenance-related issues",
          "service reductions",
          "financial burdens",
        ],
      },
      allOf: [
        {
          if: {
            properties: { category: { const: "habitability problems" } },
          },
          then: {
            properties: {
              subcategory: {
                enum: [
                  "waterproofing and weather protection",
                  "plumbing and water issues",
                  "heating and gas problems",
                  "electrical and lighting issues",
                  "structural and safety concerns",
                  "pest control and sanitation",
                  "ventilation problems",
                  "noise complaints",
                ],
              },
            },
            allOf: [
              {
                if: {
                  properties: {
                    subcategory: {
                      const: "waterproofing and weather protection",
                    },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "ineffective waterproofing causing wet or moldy walls",
                        "inadequate weather protection for roofs, walls, or ceilings, including broken windows and doors",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: {
                    subcategory: { const: "plumbing and water issues" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "defective plumbing, drains, and sewage systems",
                        "recurring water leaks from ceilings, walls, or pipes causing damage",
                        "loss of or insufficient hot water supply",
                        "cloudy or discolored water from taps",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: {
                    subcategory: { const: "heating and gas problems" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "malfunctioning heaters during cold weather",
                        "unsafe or leaking gas appliances and systems emitting harmful levels of gas",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: {
                    subcategory: { const: "electrical and lighting issues" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "unsafe or outdated electrical wiring causing outages or fire hazards",
                        "inoperative lighting in units or common areas",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: {
                    subcategory: { const: "structural and safety concerns" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "cracked, broken, or rotting floors, stairs, railings, and balconies",
                        "loose or broken windowpanes and doors creating security and weather exposure risks",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: {
                    subcategory: { const: "pest control and sanitation" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "recurring infestations of ants, cockroaches, rodents, or spiders",
                        "unsanitary conditions in shared spaces, such as trash accumulation or animal waste",
                        "overflowing trash bins attracting vermin such as rats and cockroaches",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: {
                    subcategory: { const: "ventilation problems" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "inadequate ventilation in kitchens and bathrooms causing condensation and mold",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: { subcategory: { const: "noise complaints" } },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "persistent noise disturbances from neighboring units or external sources, disrupting quiet enjoyment",
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
        {
          if: {
            properties: { category: { const: "maintenance-related issues" } },
          },
          then: {
            properties: {
              subcategory: {
                enum: [
                  "delayed or inadequate repairs",
                  "appliance failures",
                  "exterior and common area maintenance",
                  "trash and sanitation",
                  "paint, flooring, and fixtures",
                  "outdoor spaces",
                ],
              },
            },
            allOf: [
              {
                if: {
                  properties: {
                    subcategory: { const: "delayed or inadequate repairs" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "prolonged delays in fixing reported issues like leaks, heaters, or plumbing",
                        "temporary fixes, such as duct tape or tarps, instead of permanent solutions",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: { subcategory: { const: "appliance failures" } },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "non-functional appliances, such as stoves, dishwashers, or hvac systems",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: {
                    subcategory: {
                      const: "exterior and common area maintenance",
                    },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "unmaintained outdoor spaces, including overgrown yards and cracked parking areas",
                        "neglected gym equipment, recreation rooms, and unmaintained laundry machines",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: {
                    subcategory: { const: "trash and sanitation" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "overflowing trash bins and insufficient waste disposal systems",
                        "poor trash management leading to unsanitary common areas",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: {
                    subcategory: { const: "paint, flooring, and fixtures" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "peeling, crumbling, or stained paint and wall coverings",
                        "carpets with holes, cracks, or disintegrating material",
                        "missing or cracked tiles and deteriorated flooring",
                        "damaged countertops, cabinets, and drawers",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: { subcategory: { const: "outdoor spaces" } },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "unsafe balconies and patios with rusting railings and cracked floors",
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
        {
          if: {
            properties: { category: { const: "service reductions" } },
          },
          then: {
            properties: {
              subcategory: {
                enum: [
                  "restricted amenities",
                  "security issues",
                  "on-site management",
                ],
              },
            },
            allOf: [
              {
                if: {
                  properties: {
                    subcategory: { const: "restricted amenities" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "closure or neglect of recreational facilities like swimming pools, gyms, and play areas",
                        "reduced access to storage spaces, laundry facilities, and parking",
                        "defective or inoperative elevator",
                        "broken or missing mailbox",
                        "lack of landscaping or yard-care services",
                        "issues with play areas, yards, patios, balconies",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: { subcategory: { const: "security issues" } },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "broken or defective security gates, intercoms, doors, fencing or exterior lights",
                        "unsecured common areas due to open gates or broken locks",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: { subcategory: { const: "on-site management" } },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "lack of on-site resident manager services for rental properties with 16 or more units",
                        "ineffective tenant communication portals for reporting issues",
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
        {
          if: {
            properties: { category: { const: "financial burdens" } },
          },
          then: {
            properties: {
              subcategory: {
                enum: ["unlawful utility charges", "unlawful rent adjustments"],
              },
            },
            allOf: [
              {
                if: {
                  properties: {
                    subcategory: { const: "unlawful utility charges" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "tenants being overcharged for utilities or forced to pay for inefficiencies caused by poorly maintained systems",
                        "charging unauthorized utility fees or insurance costs",
                      ],
                    },
                  },
                },
              },
              {
                if: {
                  properties: {
                    subcategory: { const: "unlawful rent adjustments" },
                  },
                },
                then: {
                  properties: {
                    issueType: {
                      enum: [
                        "improper, sudden or unnotified rent increases",
                        "rent increases during unresolved habitability issues, adding undue financial strain on tenants",
                        "failure to roll back rents as required by local ordinances",
                        "back-charging for rent discounts or concessions",
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      ],
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
