import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getEventAttendees(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId/attendees', {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        })
      }
    }, async (req, reply) => {
      const { eventId } = req.params

      const attendees = await prisma.attendee.findMany({
        where: {
          eventId,
        }
      })

      return reply.send(attendees)
    })
}
