import {FastifyInstance} from "fastify";
import { createTransport } from 'nodemailer';

export const RoutePostEmail = (server: FastifyInstance) => {
    server.post('/email', {}, async (request, reply) => {
        const info = await SendEmail();
        reply.send({message: 'ok', info})
    })
}

async function SendEmail(){
    const transporter = createTransport({
        host: process.env.HOST,
        port: parseInt(process.env.SECURITY_PORT),
        secure: process.env.SECURE,
        auth: {
            user: process.env.HOST_EMAIL,
            pass: process.env.HOST_EMAIL_PASSWORD,
        },
    });

    return await transporter.sendMail({
        from: process.env.TEST_EMAIL_FROM,
        to: process.env.TEST_EMAIL_TO,
        subject: "Hello ✔",
        text: "Hello world?", // plain‑text body
        html: "<b>Hello world?</b>", // HTML body
    });
}