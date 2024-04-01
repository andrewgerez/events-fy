import fastify from 'fastify'
import { z } from 'zod'
import { prisma } from './lib/prisma'

export const app = fastify()

app.post('/events', async (req, reply) => {
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

  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug: new Date().toISOString(), // TODO: generate slug
    }
  })

  return reply.status(201).send({
    eventId: event.id,
  })
})
