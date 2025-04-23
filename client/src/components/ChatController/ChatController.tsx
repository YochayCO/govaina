import React, { useEffect, useRef, useState } from 'react'
import { DotLoader } from 'react-spinners'
import { IconButton } from '@mui/joy'
import { Message } from '@ai-sdk/react'
import { useNavigate } from 'react-router'
import { ArrowBack } from '@mui/icons-material'
import { sendNewMessage } from '../../api/chat'
import ChatMessage from '../ChatMessage/ChatMessage'
import UserInput from '../UserInput/UserInput'
import { ChatEvent, ChatEventType } from '../../types/streams'

import './ChatController.css'

const INITIAL_MESSAGE_TEXT = 'יש לי מספר החלטה'

function ChatController() {
  const requestInProgress = useRef(false)
  const conversationId = useRef<string>(undefined);
  const [userInputValue, setUserInputValue] = useState(INITIAL_MESSAGE_TEXT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  const updateLastMessage = (updateContentFn: (currentContent: string) => string) => {
    setMessages((messages) => {
      const newMessages = [...messages];
      const lastMessage = newMessages[newMessages.length - 1];

      if (!lastMessage) {
        console.error('No last message to update')
        return newMessages;
      }
      
      newMessages[newMessages.length - 1] = { 
        ...lastMessage, 
        content: updateContentFn(lastMessage.content) 
      };
      return newMessages;
    });
  };

  const setLastMessageContent = (newContent: string) => {
    updateLastMessage(() => newContent);
  };

  const appendDeltaToLastMessage = (delta: string) => {
    updateLastMessage((currentContent) => currentContent + delta);
  };

  const sendNewInput = async (e?: React.FormEvent<Element>) => {
    e?.preventDefault();
    const newMessageContent = userInputValue.trim();

    // If answer is streaming or user input is empty, don't send a new message
    if (requestInProgress.current || newMessageContent === '') return
    requestInProgress.current = true
    
    setMessages((messages) => [...messages, {
      id: `fake-message-id-${messages.length}`,
      role: 'user',
      content: userInputValue,
    }])
    setUserInputValue('')

    try {
      const chatEventStream = await sendNewMessage(newMessageContent, conversationId.current);

      for await (const chatEvent of chatEventStream) {
        processChatEvent(chatEvent);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message');
      requestInProgress.current = false;
    }
  }

  useEffect(() => {
    sendNewInput()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUserInputValue(event.target.value)
  }

  return (
    <div className="chat-interface">
      <div className="return-to-actions">
        <IconButton
          className="return-button"
          onClick={() => navigate('/')}
          variant="soft"
          title="חזרה למסך הראשי"
        >
          <ArrowBack />
        </IconButton>
      </div>

      <div className="messages-section">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <form className="inputs-form" onSubmit={sendNewInput}>
        {requestInProgress.current && (
          <div>
            {messages[messages.length - 1]?.content === '' && (
              <div className="loader-container">
                <DotLoader className="loader" />
              </div>
            )}
          </div>
        )}
        {error && (
          <>
            <div>An error occurred.</div>
          </>
        )}
        <div className="user-input-container">
          <UserInput
            className="user-input"
            value={userInputValue}
            type="textarea"
            onChange={handleInputChange}
            onSubmit={sendNewInput}
            disabled={requestInProgress.current}
          />
        </div>
      </form>
    </div>
  )

  function processChatEvent(chatEvent: ChatEvent) {
    switch (chatEvent.type) {
      case ChatEventType.MessageCreated:
        conversationId.current = chatEvent.conversationId // set conversation ID
        break
      case ChatEventType.MessageAdded:
        setMessages((messages) => [...messages, chatEvent.message])
        break
      case ChatEventType.MessageDelta:
        appendDeltaToLastMessage(chatEvent.delta) // update state with new chunk
        break
      case ChatEventType.MessageCompleted:
        setLastMessageContent(chatEvent.text) // update state with final message
        requestInProgress.current = false;
        break
      default:
        break
    }
  }
}

export default ChatController
