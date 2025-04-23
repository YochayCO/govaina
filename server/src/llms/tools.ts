import { Tool } from "openai/resources/responses/responses"

export type ToolName = 'evaluate_existing_decision' | 'evaluate_decision'

const tools: Record<ToolName, Tool> = {
  evaluate_existing_decision: {
    type: 'function',
    name: 'evaluate_existing_decision',
    description: 'Evaluates an existing government decision.',
    strict: true,
    parameters: {
      type: 'object',
      required: ['decision_text'],
      properties: {
        decision_text: {
          type: 'string',
          description: 'Text of the government decision to be evaluated',
        },
        decision_number: {
          type: 'string',
          description:
            'Decision number (an identifying string) of the government decision',
        },
        government_number: {
          type: 'number',
          description:
            'The serial number of the government who made the decision',
        },
      },
      additionalProperties: false,
    },
  },
  evaluate_decision: {
    type: 'function',
    name: 'evaluate_decision',
    description: 'Evaluates a government decision.',
    strict: true,
    parameters: {
      type: 'object',
      required: ['decision_text', 'decision_number', 'government_number'],
      properties: {
        decision_text: {
          type: ['string'], // TODO: make it optional for db case
          description: 'Text of the government decision to be evaluated',
        },
        decision_number: {
          type: ['string', 'null'],
          description: 'A string identifier of the decision',
        },
        government_number: {
          type: ['number', 'null'],
          description: 'The serial number of the government who made the decision - in range 1 to 37'
        }
      },
      additionalProperties: false,
    },
  },
}

export default tools
