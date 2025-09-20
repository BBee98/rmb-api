export const FormTypeProperties = {
    email: {
        type: 'object',
        required: ['from', 'to', 'subject', 'text', 'html'],
        properties: {
            from: {type: 'string'},
            to: {type: 'string'},
            subject: {type: 'string'},
            text: {type: 'string'},
            html: {type: 'string'},
        }
    }
}