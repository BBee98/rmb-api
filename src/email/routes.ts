import {FastifyInstance} from "fastify";
import { createTransport } from 'nodemailer';
import {Middleware} from "./middleware";

export const RoutePostEmail = (server: FastifyInstance) => {
    server.post('/email', {schema: Middleware.FormBody(), attachValidation: true }, async (request, reply) => {
        const info = await SendEmail();
        if (request.validationError) {
            // `req.validationError.validation` contains the raw validation error
            reply.code(400).send({
                message: "Error custom"
            })
        }
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