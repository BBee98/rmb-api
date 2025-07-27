# RMB Server

# 1. Introducción

Este proyecto se ha hecho para continuar aprendiendo los fundamentos más importantes en la creación
de una API RESTful.

# 2. Dependencias principales

- **Typescript**
- **Tsup** para la transpilación a javascript.

[👉 Link https://tsup.egoist.dev/#install ]

- **Fastify** para la construcción de la API.
- **Fastify/cors** para evitar el problema de CORS

[ 👉 Command npm i @fastify/cors ]

- **Jest** para el testing.
- **Fastify/swagger** para la documentación de swagger
- **EJS** para crear templates en el backend
- **Nodemailer** para enviar emails



# Primeros pasos

## Preparación del servidor

Creamos el fichero `app.ts` dentro de la carpeta `src` y preparamos el servidor:

````typescript

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
````

Y preparamos los scripts necesarios para facilitarnos la tarea:


```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "build": "npm run clean && tsup-node src/main.ts dist/main.js --minify",
    "test": "test",
    "start": "npm run build && node dist/main.js"
  }
}
```

