import {FastifyInstance, FastifyRequest} from "fastify";
import { createTransport } from 'nodemailer';
import {Middleware} from "./middleware";
import {ErrorHandler} from "./error-handler";

export const RoutePostEmail = (server: FastifyInstance) => {
    server.post('/email', {schema: Middleware.FormBody(), attachValidation: true }, async (request, reply) => {
        if (request.validationError) {
            return ErrorHandler(request, reply).ValidationSchema();
        }
        const info = await SendEmail(request);
        reply.send({message: 'ok', info})
    })
}

async function SendEmail(request: FastifyRequest){
    const email = request.body.email;
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
        from: email.from,
        to: email.to,
        subject: email?.subject || "",
        text: email.text, // plain‑text body
        html: email.html, // HTML body
    });
}