import { OpenAI } from 'openai';
import { catchError } from './common';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-fgvdbOMEi46sit0opJ6AlWJi",
});

// Create a thread and run it
export async function performCompletion(
    userMessageText: string, systemInstructions: string
): Promise<[Error] | [undefined, string]> {
    const [error, completionObj] = await catchError(openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 1,
        top_p: 1,
        messages: [
            { role: 'system', content: systemInstructions }, 
            { role: "user", content: userMessageText }
        ],
    }));
    
    if (error) {
        return [error];
    }

    const evaluation = completionObj.choices[0].message.content
    if (!evaluation) return [new Error('Empty evaluation')]
    
    return [undefined, evaluation]
}
