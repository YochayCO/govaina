import createHttpError from 'http-errors';
import { checkForExistingEvals, createEval } from '../dal/evaluations';
import { upsertDecision } from '../dal/decisions';
import { performCompletion } from '../api/openai'
import { ASSISTANT_INSTRUCTIONS } from './ASSISTANT_INSTRUCTIONS';

export const evaluateDecision = async (decisionNumber: number, decisionText: string): Promise<[Error] | [undefined, string]> => {
  const userMessageText = `${decisionText}`;

  // Check for existing evaluations
  const [existingEvalCheckErr, existingEval] = await checkForExistingEvals(decisionNumber);

  // If there is an unknown error checking for existing evaluations, return it
  if (existingEvalCheckErr) {
    if (existingEvalCheckErr.message.includes('More than one existing evaluation')) {
      console.warn(`Waring: ${existingEvalCheckErr}`);
    }
    
    return [existingEvalCheckErr];
  }

  // If there is an existing evaluation, return it
  if (existingEval) {
    console.log(`Returning existing evaluation for decision number ${decisionNumber}`);
    return [undefined, existingEval];
  }

  // Otherwise, proceed to create a new evaluation
  const [[completionReqErr, evalText], [decisionInsertErr]] = await Promise.all([
    performCompletion(userMessageText, ASSISTANT_INSTRUCTIONS),
    upsertDecision(decisionNumber, decisionText),
  ])

  if (completionReqErr || decisionInsertErr || !evalText) {
    return [completionReqErr || decisionInsertErr || createHttpError(500, 'Evaluated empty response')];
  }

  // Save evaluation in DB
  const [evalInsertErr] = await createEval(decisionNumber, evalText);
  
  if (evalInsertErr) {
    return [evalInsertErr];
  }
  console.log(`Evaluation for decision number ${decisionNumber} saved successfully`);

  return [undefined, evalText];
}
