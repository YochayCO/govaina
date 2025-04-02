import { getDecisionId } from "../utils/decisions";
import { supabase } from "./supabaseClient";

export const upsertDecision = async (
    decisionNumber: number,
    decisionText: string
): Promise<[Error | undefined]> => {
    const decisionId = getDecisionId(decisionNumber);

    console.log(`Upserting decision with ID: ${decisionId}`);

    const { error } = await supabase
        .from("Decisions")
        .upsert({ id: decisionId, num: decisionNumber, text: decisionText });

    return [error ? new Error(error.message) : undefined];
};
