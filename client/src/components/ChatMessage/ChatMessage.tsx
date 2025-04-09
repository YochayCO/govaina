import { Message } from '@ai-sdk/react'
import { Avatar } from '@mui/joy'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AccountCircle } from '@mui/icons-material'

import './ChatMessage.css'

const ROLE_TO_IMG = {
  assistant: '/CECI-logo.png',
}

export interface ChatMessageProps {
  message: Message
}

function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div key={message.id} className="message">
      <div className="message-role">
        {message.role === 'assistant' ? (
          <Avatar src={ROLE_TO_IMG[message.role]} size="sm" />
        ) : (
          <Avatar size="sm">
            <AccountCircle sx={{ width: '36px', height: '36px' }} />
          </Avatar>
        )}
      </div>
      <div className="message-text">
        <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
      </div>
    </div>
  )
}

export default ChatMessage
