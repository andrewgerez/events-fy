import { FastifyInstance } from 'fastify'
import { BadRequest } from './routes/_errors/bad-request'
import { ZodError } from 'zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (err, req, reply) => {
  const { validation, validationContext } = err

  if (err instanceof ZodError) {
    return reply.status(400).send({
      message: `Error during validation`,
      errors: err.flatten().fieldErrors,
    })
  }

  if (err instanceof BadRequest) {
    return reply.status(400).send({ message: err.message })
  }

  return reply.status(500).send({ message: 'Internal server error!' })
}
