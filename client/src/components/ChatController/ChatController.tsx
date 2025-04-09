import React, { useState } from "react"
import { IoReturnUpBackOutline } from "react-icons/io5"
import { DotLoader } from "react-spinners"
import { IconButton, Input, Textarea } from "@mui/joy"
import { useChat } from '@ai-sdk/react'

import { checkForExistingEvals } from "../../api/backend/evaluations"
import { UserAction } from "../../types/users"

import './ChatController.css'

export interface ChatControllerProps {
  selectedAction: UserAction | null
  selectAction: (action: UserAction | null) => void
}

const INITIAL_MESSAGE = {
  id: '1',
  role: 'assistant' as const,
  content: 'הזן מספר החלטה',
}
const THIRD_MESSAGE = {
  id: '3',
  role: 'assistant' as const,
  content: 'הזן את תוכן ההחלטה',
}

function ChatController({ selectAction }: ChatControllerProps) {
  const [decisionNumber, setDecisionNumber] = useState<number>(0)
  const { messages, input, setInput, setMessages, handleSubmit, status, stop, error, reload } = useChat({
    api: '/api/evaluations/',
    initialMessages: [INITIAL_MESSAGE],
  });

  const lastMessage = messages[messages.length - 1]
  const isLastMessageRoleUser = lastMessage.role === 'user'

  const isLastMessageFinal = (
    (messages[messages.length - 1]?.annotations?.[0] as { finalMessage?: boolean })?.finalMessage ||
    messages.length > 3
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(event.target.value)
  }

  const processUserAction: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (isLastMessageFinal) {
      return
    }

    if (messages.length === 1) {
      setMessages((currMessages) => {
        const newMessages = [...currMessages, {
          id: '2',
          role: 'user' as const,
          content: `מספר החלטה: ${input}`,
        }]
        return newMessages
      })
      
      const newDecisionNumber = parseInt(input)
      const [err, evaluation] = await checkForExistingEvals(newDecisionNumber)
      setInput('')
      setDecisionNumber(newDecisionNumber)

      if (err) {
        console.error(err)
        return
      }
      if (evaluation) {
        setMessages((currMessages) => [...currMessages, {
          id: '3',
          role: 'assistant',
          content: `תוכן ההחלטה: ${evaluation}`,
          annotations: [{ finalMessage: true }],
        }])
      } else {
        setMessages((currMessages) => [...currMessages, THIRD_MESSAGE])
      }
    }
    
    if (messages.length === 3) {
      handleSubmit(event, {
        body: { decisionNumber },
      })

      return
    }
  }

  return (
    <>
      <div className='return-to-actions'>
        <IconButton
          className='return-button'
          onClick={() => selectAction(null)}
          variant="soft"
        >
          <IoReturnUpBackOutline />
        </IconButton>
      </div>

      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}

      <form className="inputs-form" onSubmit={processUserAction}>
        {messages.length === 1 && (
          <>
            <Input
              className='decision-number-input'
              placeholder="מה מספר ההחלטה?"
              value={input}
              onChange={handleInputChange}
            />
          </>
        )}
        {messages.length === 3 && !isLastMessageFinal && (
          <>
            <Textarea
              className='decision-text-input'
              value={input}
              onChange={handleInputChange}
              placeholder="הדביקו כאן את תוכן ההחלטה"
              minRows={4}
            />
          </>
        )}
        {!isLastMessageFinal && !isLastMessageRoleUser && (
          <button className='evaluate-button' type='submit'>Next</button>
        )}
      </form>

      {(status === 'submitted' || status === 'streaming') && (
        <div>
          {status === 'submitted' && <DotLoader className="loader" />}
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}
      {error && (
        <>
          <div>An error occurred.</div>
          <button type="button" onClick={() => reload()}>
            Retry
          </button>
        </>
      )}
    </>
  )
}

export default ChatController
