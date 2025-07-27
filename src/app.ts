import Fastify from 'fastify';
import cors from '@fastify/cors'

const server = Fastify({
    logger: true
});

server.register(cors)

export function Serve(){
    server.listen({port: 1357}, (err) => {
        if (err) throw err;
        console.log(`Server running`);
    })
}