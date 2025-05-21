import OpenAI from 'openai'
import { Stream } from 'openai/streaming'
import { getAssistantConfig, getEvaluatorConfig } from '../llms/configs'
import { LLMReqParams } from '../types/prompts'
import { ResponseFunctionToolCall } from 'openai/resources/responses/responses'
import { ToolName } from '../llms/tools'

const openai = new OpenAI()

export async function getAssistantResponse(
  llmReqParams: LLMReqParams,
): Promise<Stream<OpenAI.Responses.ResponseStreamEvent>> {
  const promptConfig = getAssistantConfig(llmReqParams)
  const result = await openai.responses.create(promptConfig)

  return result
}

export async function getEvaluatorResponse(
  llmReqParams: LLMReqParams,
): Promise<OpenAI.Responses.Response> {
  const promptConfig = getEvaluatorConfig(llmReqParams)
  const result = await openai.responses.create(promptConfig)

  return result
}

export async function callFunction(
  toolCall: ResponseFunctionToolCall,
): Promise<[Error] | [undefined, string]> {
  try {
    const toolName = toolCall.name as ToolName
    const toolArgs = JSON.parse(toolCall.arguments) as { decision_text: string}
  
    if (toolName === 'evaluate_existing_decision') {
      // Search for evaluation via decision & gov number
      // If exists - return existing evaluation
      // Else -
      // Evaluate decision, return it
      // return
    }
  
    // Else - evaluate draft and return it
    const evaluationRes = await getEvaluatorResponse({
      newInput: [{ role: 'user', content: toolArgs.decision_text }],
      promptId: 'EVALUATION_PROMPT',
    })
  
    return [undefined, evaluationRes.output_text]
  } catch (error) {
    return [error as Error]
  }
}