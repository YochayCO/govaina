import { ResponseOutputMessage } from "openai/resources/responses/responses";
import { Request, Response, NextFunction } from "express";
import { getLlmResponse } from "../api/openai";
import { ChatEvent, ChatEventType, OpenAIEventType } from "../types/streams";

export const chatController = async (req: Request, res: Response, next: NextFunction) => {
    const { newMessageContent, conversationId } = req.body as { conversationId: string; newMessageContent: string; };

    const responseStream = await getLlmResponse(newMessageContent, conversationId);
    
    res.setHeader('Content-Type', 'application/jsonl; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')

    try {
        for await (const responsePart of responseStream) {
            let chatEvent: ChatEvent, resOutputMessage: ResponseOutputMessage;

            switch (responsePart.type) {
                case OpenAIEventType.ResponseCreated:
                    chatEvent = { type: ChatEventType.MessageCreated, conversationId: responsePart.response.id }
                    res.write(JSON.stringify(chatEvent) + '\n')
                    break;
                case OpenAIEventType.ResponseOutputItemAdded:
                    resOutputMessage = (responsePart.item as ResponseOutputMessage)
                    chatEvent = { 
                        type: ChatEventType.MessageAdded, 
                        message: {
                            id: resOutputMessage.id,
                            role: resOutputMessage.role,
                            content: resOutputMessage.content.join(),
                        }
                    }
                    res.write(JSON.stringify(chatEvent) + '\n')
                    break;
                case OpenAIEventType.ResponseOutputTextDelta:
                    chatEvent = { type: ChatEventType.MessageDelta, delta: responsePart.delta }
                    res.write(JSON.stringify(chatEvent) + '\n')
                    break;
                case OpenAIEventType.ResponseOutputTextDone:
                    chatEvent = { type: ChatEventType.MessageCompleted, text: responsePart.text }
                    res.write(JSON.stringify(chatEvent) + '\n')
                    break;
                // case 'response.completed':
                    // has a lot of data
            }
        }
    
        res.end()
    } catch (error) {
        next(error)
    }
}
