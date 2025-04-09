import { streamText, StreamTextResult, ToolSet } from 'ai';
import { openai } from '@ai-sdk/openai';

// Create a stream and run it
export function performCompletion(
    userMessageText: string, systemInstructions: string
): StreamTextResult<ToolSet, never> {
    const result = streamText({
        model: openai("gpt-4o-mini-2024-07-18"),
        temperature: 1,
        topP: 1,
        system: systemInstructions,
        messages: [
            { role: "user", content: userMessageText }
        ],
    });

    return result
}
