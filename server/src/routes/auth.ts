import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { verifyAuthentication } from "../plugins/verifyAuthentication";

const authenticationBody = z.object({
  accessToken: z.string()
})

const userSchema = z.object({
id: z.string(),
email: z.string().email(),
name: z.string(),
  picture: z.string().url()
})

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth', async (request) => {

    const { accessToken } = authenticationBody.parse(request.body)

    const authResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const userData = await authResponse.json()
    const userInfo = userSchema.parse(userData)

    let user = await prisma.user.findUnique({
      where: {
        id: userInfo.id
      }
    }) || await prisma.user.create({
      data: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        avatarUrl: userInfo.picture
      }
    })

    const token = fastify.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl
    }, {
      sub: user.id,
      expiresIn: '7 days'
    })

    return { token }
  })

  fastify.get('/me', { onRequest: [verifyAuthentication] }, async (request) => {
    return { user: request.user }
  })
}