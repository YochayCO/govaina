import createHttpError from "http-errors";
import { supabase } from "./supabaseClient";
import { getDecisionId } from "../utils/decisions";

export const checkForExistingEvals = async (
    decisionNumber: number
): Promise<[Error] | [undefined, string | null]> => {
    const { data, error } = await supabase
        .from("Evaluations")
        .select("eval")
        .eq("decision_id", getDecisionId(decisionNumber))
        .limit(2);

    if (error) return [error];
    if (data.length > 1) return [createHttpError(500, `More than one existing evaluation: ${data}`)]

    return [undefined, data.length === 1 ? data[0].eval : null];
};

export const createEval = async (
    decisionNumber: number,
    evalText: string
): Promise<[Error | undefined]> => {
    const { error } = await supabase.from("Evaluations").insert({
        decision_id: getDecisionId(decisionNumber),
        eval: evalText,
    });

    return [error ? new Error(error.message) : undefined];
};
