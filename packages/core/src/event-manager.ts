import { globalLogger } from './logger'
import { addEventToQueue, processQueue } from './queue-manager'
import { Event, EventManager, Handler, SubscribeConfig, UnsubscribeConfig, QueueConfig } from './types'

type EventHandler = {
  filePath: string
  handler: Handler
  queue?: QueueConfig
}

export const createEventManager = (): EventManager => {
  const handlers: Record<string, EventHandler[]> = {}

  const emit = async <TData>(event: Event<TData>, file?: string) => {
    const eventHandlers = handlers[event.topic] ?? []
    const { logger, ...rest } = event

    logger.debug('[Flow Emit] Event emitted', { handlers: eventHandlers.length, data: rest, file })
    eventHandlers.map((eventHandler) => {
      if (eventHandler.queue?.strategy === 'fifo') {
        const queueName = eventHandler.queue.messageGroupId || event.topic
        addEventToQueue(queueName, event, eventHandler.queue)
        processQueue(queueName, async (event) => {
          await eventHandler.handler(event)
        })
      } else {
        eventHandler.handler(event)
      }
    })
  }

  const subscribe = <TData>(config: SubscribeConfig<TData>) => {
    const { event, handlerName, handler, filePath, queue } = config

    if (!handlers[event]) {
      handlers[event] = []
    }

    globalLogger.debug('[Flow Sub] Subscribing to event', { event, handlerName })
    handlers[event].push({ filePath, handler: handler as Handler, queue })
  }

  const unsubscribe = (config: UnsubscribeConfig) => {
    const { filePath, event } = config
    handlers[event] = handlers[event]?.filter((handler) => handler.filePath !== filePath)
  }

  return { emit, subscribe, unsubscribe }
}
