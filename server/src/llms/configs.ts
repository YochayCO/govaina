import OpenAI from "openai"
import prompts from "./prompts"
import tools from "./tools"
import { LLMReqParams } from "../types/prompts"

export const getAssistantConfig = ({
  newInput,
  promptId,
  conversationId,
}: LLMReqParams): OpenAI.Responses.ResponseCreateParamsStreaming => {
  return {
    model: 'gpt-4o-mini-2024-07-18',
    temperature: 1,
    top_p: 1,
    instructions: prompts[promptId],
    input: newInput,
    tools: [tools.evaluate_decision],
    previous_response_id: conversationId,
    stream: true,
    store: true,
  }
}

export const getEvaluatorConfig = ({
  newInput,
  promptId,
}: LLMReqParams): OpenAI.Responses.ResponseCreateParamsNonStreaming => {
  return {
    model: 'gpt-4o-mini-2024-07-18',
    temperature: 1,
    top_p: 1,
    instructions: prompts[promptId],
    input: newInput,
    tools: [],
  }
}
