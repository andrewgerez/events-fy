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
        }),
        querystring: z.object({
          pageIndex: z.string().nullable().default('0').transform(Number),
        })
      }
    }, async (req, reply) => {
      const { eventId } = req.params
      const { pageIndex } = req.query

      const attendees = await prisma.attendee.findMany({
        where: {
          eventId,
        },
        take: 10,
        skip: pageIndex * 10,
      })

      return reply.send(attendees)
    })
}
