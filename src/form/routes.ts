import {FastifyInstance} from "fastify";

export const RoutePostEmail = (server: FastifyInstance) => {
    server.post('/email', async (request, reply) => {
        reply.send({message: 'ok'})
    })
}
