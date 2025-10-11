import {FastifyReply, FastifyRequest} from "fastify";
import {FormTypeProperties} from "../form/interfaces";

export const ErrorHandler = (request: FastifyRequest, reply: FastifyReply) => {

    return {
        ValidationSchema: () => {
            const email = request.body?.email;
            const validateFields = Object.keys(FormTypeProperties.email.properties);

            if(!email) {
                return reply.code(400).send({
                    message: 'Error. To fulfill the petition use the correct structure',
                    missingFields: ["email", ...validateFields]
                })
            }

            const requestFields = Object.keys(email);
            const missingFields = validateFields.filter(field => !requestFields?.includes(field));

            const message = `Error. To fulfill the petition the following ${missingFields.length > 1 ? 'fields are' : 'field is'} required.`

            return reply.code(400).send({
                message,
                missingFields
            })
        }
    }
};