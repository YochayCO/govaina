import { catchError } from "../common/errorHandler"

const API_URL = `/api`

export const evaluate = async (decisionNumber: number, decisionText: string): Promise<[Error] | [undefined, string]> => {
  const [error, response] = await catchError(fetch(`${API_URL}/evaluations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decisionNumber, decisionText })
  }));

  if (error) {
    return [error]
  }

  const evaluationText = await response.text();
  
  return [undefined, evaluationText]
}
