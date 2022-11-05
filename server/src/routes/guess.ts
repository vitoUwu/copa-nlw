import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { verifyAuthentication } from "../plugins/verifyAuthentication";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count();
    return { count }
  })

  fastify.post('/guesses/:pollId/games/:gameId', { onRequest: [verifyAuthentication] }, async (request, reply) => {
    const createGuessParams = z.object({
      pollId: z.string(),
      gameId: z.string()
    })

    const guessBody = z.object({
      firstTeamPoints: z.number(),
      secondTeamPoints: z.number()
    })

    const { pollId, gameId } = createGuessParams.parse(request.params)
    const { firstTeamPoints, secondTeamPoints } = guessBody.parse(request.body)

    const participant = await prisma.participant.findUnique({
      where: {
        userId_pollId: {
          pollId,
          userId: request.user.sub
        }
      }
    })

    if (!participant) return reply.code(400).send({ message: 'you are not allowed to create a guess inside this poll'  })

    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          gameId,
          participantId: participant.id
        }
      }
    })

    if (guess) return reply.code(400).send({ message: 'you already sent a guess to this game on this poll' })

    const game = await prisma.game.findUnique({
      where: {
        id: gameId
      }
    })

    if (!game) return reply.code(400).send({ message: 'Game not found' })
    
    if (game.date <= new Date()) return reply.code(400).send({ message: 'you cannot send guesses after the game has been ended' })

    await prisma.guess.create({
      data: {
        firstTeamPoints,
        secondTeamPoints,
        gameId,
        participantId: participant.id
      }
    })

    return reply.code(201).send({})
  })
}