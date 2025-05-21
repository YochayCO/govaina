import { ChatEvent } from '../types/streams'

export async function sendNewMessage(
  newMessageContent: string,
  conversationId?: string,
): Promise<AsyncGenerator<ChatEvent>> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ newMessageContent, conversationId }),
    headers: {
      Accept: 'application/jsonl; charset=utf-8',
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok || !response.body) {
    throw new Error(response.statusText)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')

  async function* parseStream() {
    let buffer = ''
    let done = false

    while (!done) {
      const { value, done: isReaderDone } = await reader.read()
      done = isReaderDone

      if (!value) return
      buffer += decoder.decode(value, { stream: true })

      let newlineIndex

      while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
        const chunk = buffer.slice(0, newlineIndex)
        buffer = buffer.slice(newlineIndex + 1)

        if (!chunk) continue

        try {
          const chatEvent = JSON.parse(chunk) as ChatEvent
          yield chatEvent
        } catch (error) {
          console.error('Error parsing chunk:', error)
        }
      }
    }
  }

  return parseStream()
}
