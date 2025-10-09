import Fastify from 'fastify';
import cors from '@fastify/cors'
import {config} from "dotenv";
import {routes} from "./routes";

export const server = Fastify({
    logger: true
});

server.register(cors, {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']

});


export function serve(){
    server.listen({port: 1357}, (err) => {
        if (err) throw err;
        console.log(`Server running`);
    })
}

export async function startServer(){
    try {
        config();

        routes();

        serve();

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}