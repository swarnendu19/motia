import { Event, QueueConfig } from './types'

type Queue = {
  name: string
  events: Event<unknown>[]
  processedDeduplicationIds: Set<string>
}

const queues: Record<string, Queue> = {}

export const getQueue = (name: string): Queue => {
  if (!queues[name]) {
    queues[name] = {
      name,
      events: [],
      processedDeduplicationIds: new Set(),
    }
  }
  return queues[name]
}

export const addEventToQueue = (
  queueName: string,
  event: Event<unknown>,
  queueConfig?: QueueConfig,
): void => {
  const queue = getQueue(queueName)
  if (queueConfig?.messageDeduplicationId) {
    if (queue.processedDeduplicationIds.has(queueConfig.messageDeduplicationId)) {
      return
    }
    queue.processedDeduplicationIds.add(queueConfig.messageDeduplicationId)
  }
  queue.events.push(event)
}

export const processQueue = (
  queueName: string,
  handler: (event: Event<unknown>) => Promise<void>,
): void => {
  const queue = getQueue(queueName)
  const event = queue.events.shift()
  if (event) {
    handler(event).finally(() => {
      processQueue(queueName, handler)
    })
  }
}
