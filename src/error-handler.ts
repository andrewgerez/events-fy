import { FastifyInstance } from 'fastify'
import { BadRequest } from './routes/_errors/bad-request'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (err, req, reply) => {
  if (err instanceof BadRequest) {
    return reply.status(400).send({ message: err.message })
  }

  return reply.status(500).send({ message: 'Something went wrong' })
}
