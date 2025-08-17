import { addEventToQueue, getQueue, processQueue } from '../queue-manager'
import { Event } from '../types'
import { mock } from 'jest-mock-extended'

describe('QueueManager', () => {
  it('should add an event to a queue', () => {
    const queueName = 'test-queue'
    const event = mock<Event>()
    addEventToQueue(queueName, event)
    const queue = getQueue(queueName)
    expect(queue.events).toContain(event)
  })

  it('should process events in a queue', (done) => {
    const queueName = 'test-queue-2'
    const event1 = mock<Event>()
    const event2 = mock<Event>()
    const handler = jest.fn().mockResolvedValue(undefined)

    addEventToQueue(queueName, event1)
    addEventToQueue(queueName, event2)

    processQueue(queueName, handler)

    setTimeout(() => {
      expect(handler).toHaveBeenCalledWith(event1)
      expect(handler).toHaveBeenCalledWith(event2)
      done()
    }, 100)
  })
})
