import {FormTypeProperties} from "../form/interfaces";

export const Middleware = {
    FormBody
};

function FormBody(){
    return {
        body: {
            type: 'object',
            required: Object.keys(FormTypeProperties),
            properties: FormTypeProperties
        },
    }
}