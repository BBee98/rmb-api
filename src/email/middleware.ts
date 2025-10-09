import {FormTypeProperties} from "../form/interfaces";

export const Middleware = {
    FormBody
};

function FormBody(){
    const { html, text, subject, ...requiredFields } = FormTypeProperties.email.properties;
    return {
        body: {
            type: 'object',
            required: ["email"],
            properties: FormTypeProperties
        },
    }
}