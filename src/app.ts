import fastify from 'fastify'
import { z } from 'zod'
import { prisma } from './lib/prisma'
import { generateSlug } from './utils/generate-slug'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

export const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app
  .withTypeProvider<ZodTypeProvider>()
  .post('/events', {
    schema: {
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive(),
      }),
      response: {
        201: z.object({
          eventId: z.string().uuid()
        })
      }
    }
  }, async (req, reply) => {
    const {
      title,
      details,
      maximumAttendees
    } = req.body

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
