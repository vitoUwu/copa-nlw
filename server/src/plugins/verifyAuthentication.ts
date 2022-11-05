import { FastifyRequest } from "fastify";

export async function verifyAuthentication(request: FastifyRequest) {
  await request.jwtVerify()
}