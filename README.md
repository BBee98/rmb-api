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
- **Handlebars** para crear templates en el backend
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

# 3. Creando el core de las rutas.

Una de las peculiaridades que tiene ``fastify`` es que tenemos que utilizar **siempre** el mismo objeto importado, porque sino no quedan registrados
como en el "core" de la aplicación.

- Creamos un directorio llamado ``core``, donde colocaremos todas las utilidades centrales de la aplicación.
- Creamos un fichero `app.ts` dentro del directorio `core`:

```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors'

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
```

Desde aquí exportaremos el objeto de ``Fastify``.

- A continuación, creamos un fichero llamado ``routes.ts`` dentro del directorio ``core`` recién creado. Quedará algo parecido
a esto:

````
src/
└── core/
    └── app.ts
    └── routes.ts
````

Para registrar una ruta, debemos **importar** el objeto ``fastify`` que creamos anteriormente en `app.ts`:

````typescript
import { server } from './app';

export const Routes = () => {
    server.register((app, _, done) => {
        
    }, { prefix: '/v1' })
}
````

> Suelen recomendar añadir como prefijo la versión de la API, empezando por ``v1``.

## 3.1 Primera ruta: '/email'

- Al igual que en el paso anterior, creamos un fichero llamado ``routes.ts`` dentro del directorio ``form``:

````
src/
└── core/
    └── app.ts
    └── routes.ts
└── form/
    └── routes.ts
````

Y creamos un método para registrar la ruta que deseamos:

```typescript
import {FastifyInstance} from "fastify";

export const RoutePostEmail = (server: FastifyInstance) => {
    server.post('/email', async (request, reply) => {
        reply.send({message: 'ok'})
    })
}

```

Debemos pasar por parámetro el objeto ``Fastify`` que exportamos desde `app.ts`. Ahora, en el fichero ``routes.ts``
situado en el directorio ``core``, importamos la ruta creada:

```typescript
import { server } from './app';
import {RoutePostEmail} from "../form/routes";


export const Routes = () => {
    server.register((app, _, done) => {
        RoutePostEmail(app);
        done();
    }, { prefix: '/v1' })
}
```

Todas las rutas deben de estar registradas bajo el "fastify core", y tras registrarla debemos añadir ``done()`` para indicarle a fastify
que hemos terminado los registros.

Si ahora hacemos la llamada desde **POSTMAN** o cualquier otro servicio:

```json
{
    "message": "ok"
}
```

Deberíamos recibir correctamente el ``reply`` que programamos en la ruta.


