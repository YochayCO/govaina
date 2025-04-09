import { performCompletion } from '../api/openai'
import { upsertDecision } from '../dal/decisions';
import { createEval } from '../dal/evaluations';
import { ASSISTANT_INSTRUCTIONS } from './ASSISTANT_INSTRUCTIONS';
import { StreamTextResult, ToolSet } from 'ai';

export const evaluateDecision = (decisionText: string): StreamTextResult<ToolSet, never> => {
  const streamTextResult = performCompletion(decisionText, ASSISTANT_INSTRUCTIONS)

  return streamTextResult;
}

export const saveEvalAndDecisionInDB = async (
  evaluationText: string,
  decisionNumber: number,
  decisionText: string,
): Promise<[Error | undefined]> => {
  const [decisionUpsertErr] = await upsertDecision(decisionNumber, decisionText)
  if (decisionUpsertErr) return [decisionUpsertErr]

  const [evalInsertErr] = await createEval(decisionNumber, evaluationText)
  if (evalInsertErr) return [evalInsertErr]

  console.log(`Evaluation and decision number ${decisionNumber} saved successfully`)
  return [undefined]
}
