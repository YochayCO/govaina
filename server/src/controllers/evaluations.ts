import { performCompletion } from '../api/openai'
import { ASSISTANT_INSTRUCTIONS } from './ASSISTANT_INSTRUCTIONS';

export const evaluateDecision = async (decisionText: string): Promise<[Error] | [undefined, string]> => {
  const userMessageText = `${decisionText}`;
  const [error, message] = await performCompletion(userMessageText, ASSISTANT_INSTRUCTIONS);

  if (error) {
      return [error];
  }

  if (!message) return [new Error('Empty response')];

  return [undefined, message];
}
