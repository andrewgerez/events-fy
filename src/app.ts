import fastify from 'fastify'
import { z } from 'zod'
import { prisma } from './lib/prisma'
import { generateSlug } from './utils/generate-slug'

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

  const slug = generateSlug(title)

  const eventWithSameSlug = await prisma.event.findUnique({
    where: {
      slug,
    }
  })

  if (eventWithSameSlug) {
    throw new Error('An event with the same title already exists')
  }

  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug,
    }
  })

  return reply.status(201).send({
    eventId: event.id,
  })
})
