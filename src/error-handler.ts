import { FastifyInstance } from 'fastify'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (err, req, reply) => {
  return reply.status(500).send({ message: 'Something went wrong' })
}
