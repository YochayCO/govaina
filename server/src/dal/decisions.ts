import createHttpError from "http-errors";
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

    if (error) return [createHttpError(500, error.message)]

    console.log(`Decision ${decisionNumber} saved successfully`);
    return [undefined];
};
