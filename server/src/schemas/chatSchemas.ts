import { z } from 'zod';

export const postChatSchema = z.object({
    newMessageContent: z.string(),
    conversationId: z.string().optional(),
});