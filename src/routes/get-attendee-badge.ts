import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getAttendeeBadge(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/badge', {
      schema: {
        summary: 'Get an attendee badge',
        tags: ['attendees'],
        params: z.object({
          attendeeId: z.coerce.number()
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string(),
              event: z.object({
                title: z.string(),
              }),
              checkInURL: z.string().url()
            })
          })
        }
      }
    }, async (req, reply) => {
      const { attendeeId } = req.params

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            }
          }
        },
        where: {
          id: attendeeId
        }
      })

      if (!attendee) {
        throw new Error('Attendee not found')
      }

      const baseURL = `${req.protocol}://${req.hostname}`

      const checkInURL = new URL(`/attendees/${attendeeId}/checkin`, baseURL)

      return reply.status(200).send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          event: attendee.event,
          checkInURL: checkInURL.toString()
        }
      })
    }
    )
}
