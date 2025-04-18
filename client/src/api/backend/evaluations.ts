import { catchError } from "../common/errorHandler"

const API_URL = `/api`

export const checkForExistingEvals = async (decisionNumber: number): Promise<[Error] | [undefined, string | null]> => {
  const [error, response] = await catchError(fetch(`${API_URL}/evaluations/${decisionNumber}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }));

  if (error) {
    return [error]
  }

  const jsonResponse = await response.json() as { evaluation: string | null };

  return [undefined, jsonResponse.evaluation]
}
