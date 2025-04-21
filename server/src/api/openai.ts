import OpenAI from 'openai';
import ASSISTANT_PROMPT from '../prompts/ASSISTANT_PROMPT';
import { Stream } from 'openai/streaming';

const openai = new OpenAI();

export async function getLlmResponse(
    lastMessageText: string, conversationId?: string
): Promise<Stream<OpenAI.Responses.ResponseStreamEvent>> {
    const result = await openai.responses.create({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 1,
        top_p: 1,
        instructions: ASSISTANT_PROMPT,
        input: [
            { role: "user", content: lastMessageText }
        ],
        previous_response_id: conversationId,
        stream: true,
        store: true,
    });

    return result
}
