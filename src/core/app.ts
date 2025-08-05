import Fastify from 'fastify';
import cors from '@fastify/cors'
import {config} from "dotenv";

export function ConfigEnvironment(){
    config();
}

export const server = Fastify({
    logger: true
});

server.register(cors);

export function Serve(){
    server.listen({port: 1357}, (err) => {
        if (err) throw err;
        console.log(`Server running`);
    })
}