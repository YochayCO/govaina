import React, { useState } from 'react'
import { IoReturnUpBackOutline as ReturnIcon } from 'react-icons/io5'
import { DotLoader } from 'react-spinners'
import { IconButton, Textarea } from '@mui/joy'
import { useChat } from '@ai-sdk/react'
import { useNavigate } from 'react-router'

import './ChatController.css'
import ChatMessage from '../ChatMessage/ChatMessage'
import UserInput from '../UserInput/UserInput'
import { checkForExistingEvals } from '../../api/backend/evaluations'

const INITIAL_MESSAGES = [
  {
    id: 'zero-message',
    role: 'user' as const,
    content: 'יש לי מספר החלטה',
  },
  {
    id: 'request-decison-number',
    role: 'assistant' as const,
    content: 'מעולה, לניתוח החלטה יש להזין את המספר בתיבה',
  },
]
const THIRD_MESSAGE = {
  id: 'request-decision-text',
  role: 'assistant' as const,
  content: 'הזן את תוכן ההחלטה',
}

const INPUT_PROPS_BY_STATE = {
  requestDecisionNumber: {
    placeholder: 'מה מספר ההחלטה?',
    type: 'text',
  },
  requestDecisionText: {
    placeholder: 'הדביקו כאן את תוכן ההחלטה',
    type: 'textarea',
  },
}

function ChatController() {
  const [decisionNumber, setDecisionNumber] = useState<number>(0)
  const {
    messages,
    input,
    setInput,
    setMessages,
    handleSubmit,
    status,
    stop,
    error,
    reload,
  } = useChat({
    api: '/api/evaluations/',
    initialMessages: INITIAL_MESSAGES,
  })

  // const { selectedAction } = useOutletContext()
  const navigate = useNavigate()

  const lastMessage = messages[messages.length - 1]
  const isRequestDecisionNumberState =
    lastMessage.role === 'assistant' &&
    lastMessage.id === 'request-decison-number'
  // TODO: State Machine
  const isLastMessageFinal =
    (
      messages[messages.length - 1]?.annotations?.[0] as {
        finalMessage?: boolean
      }
    )?.finalMessage || messages.length > 4
  const isRequestDecisionTextState =
    lastMessage.role === 'assistant' &&
    lastMessage.id === 'request-decison-text'

  // TODO: State Machine
  const currInputProps = isRequestDecisionNumberState
    ? INPUT_PROPS_BY_STATE.requestDecisionNumber
    : isRequestDecisionTextState
      ? INPUT_PROPS_BY_STATE.requestDecisionText
      : null

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInput(event.target.value)
  }

  const processUserAction: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()
    if (isLastMessageFinal) {
      return
    }

    if (isRequestDecisionNumberState) {
      setMessages((currMessages) => [
        ...currMessages,
        {
          id: 'decision-number',
          role: 'user' as const,
          content: `מספר החלטה: ${input}`,
        },
      ])

      const newDecisionNumber = parseInt(input)
      setInput('')
      setDecisionNumber(newDecisionNumber)

      const [err, evaluation] = await checkForExistingEvals(newDecisionNumber)

      if (err) {
        console.error(err)
        return
      }

      if (evaluation) {
        setMessages((currMessages) => [
          ...currMessages,
          {
            id: 'evaluation',
            role: 'assistant',
            content: `מצאתי את ההחלטה שחיפשת, הנה הניתוח שביצעתי עבורה:\n${evaluation}`,
            annotations: [{ finalMessage: true }],
          },
        ])
      } else {
        setMessages((currMessages) => [...currMessages, THIRD_MESSAGE])
      }
    }

    if (messages.length === 4 && !isLastMessageFinal) {
      handleSubmit(event, {
        body: { decisionNumber },
      })

      return
    }
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
          <ReturnIcon />
        </IconButton>
      </div>

      <div className="messages-section">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <form className="inputs-form" onSubmit={processUserAction}>
        {isRequestDecisionTextState && (
          <>
            <Textarea
              className="decision-text-input"
              value={input}
              onChange={handleInputChange}
              placeholder="הדביקו כאן את תוכן ההחלטה"
              minRows={4}
            />
          </>
        )}

        {(status === 'submitted' || status === 'streaming') && (
          <div>
            {status === 'submitted' && (
              <div className="loader-container">
                <DotLoader className="loader" />
              </div>
            )}
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
        {!isLastMessageFinal && lastMessage.role === 'assistant' && (
          <div className="user-input-container">
            <UserInput
              className="user-input"
              value={input}
              onChange={handleInputChange}
              {...currInputProps}
            />
          </div>
        )}
      </form>
    </div>
  )
}

export default ChatController
