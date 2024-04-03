import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function registerForEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees', {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          })
        }
      }
    }, async (req, reply) => {
      const { eventId } = req.params
      const { name, email } = req.body

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        }
      })

      return reply.status(201).send({
        attendeeId: attendee.id
      })
    }
    )
}
