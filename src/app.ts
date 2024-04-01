import fastify from 'fastify'
import { z } from 'zod'

export const app = fastify()

app.post('/events', (req, reply) => {
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive(),
  })

  const {
    title,
    details,
    maximumAttendees
  } = createEventSchema.parse(req.body)

  return reply.status(201).send({
    event: {
      title,
      details,
      maximumAttendees
    }
  })
})
