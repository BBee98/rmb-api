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

## 3.2 Configurando el email

Vamos a hacer que cuando envíes una petición a esta ruta, se envíe un correo electrónico. 

- Lo primero es reorganizar un poco el código. Vamos a hacer un directorio nuevo llamado `email` con la siguiente estructura:

````
src/
└── core/
    └── app.ts
    └── routes.ts
└── form/
    └── template.ts
└── email/
    └── routes/
       └── routes.ts
````

- Creamos una carpeta ``routes`` dentro de la carpeta `email`, con el fichero ``routes.ts`` dentro. Con esto vamos a preparar 
nuestro código para un paso posterior que tengamos que hacer.

- Pasamos el código de ``form/routes.ts``

````
import {FastifyInstance} from "fastify";

export const RoutePostEmail = (server: FastifyInstance) => {
    server.post('/email', {}, async (request, reply) => {
        reply.send({message: 'ok'})
    })
}
````

Al fichero ``routes.ts`` creado dentro del directorio ``routes``.

- Ahora, necesitamos instalar el paquete de los tipos de ``nodemailer`` para poder usarlo
adecuadamente con nuestro proyecto (que está en ``typescript``):

```
⚙️  npm i --save-dev @types/nodemailer
```

Y ahora podemos crear el método con el que enviaremos el correo: 

```typescript
function SendEmail(){
    const transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "maddison53@ethereal.email",
            pass: "jn7jnAPss4f63QBp6D",
        },
    });
}
```

Si miramos la documentación oficial:

```
🌏 https://nodemailer.com/#example-using-an-ethereal-test-account
```

Vemos que usan el siguiente ejemplo:

````javascript
const transporter = nodemailer.createTransport({
  host: "",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});
````

El método ``createTransport`` es el que nos permite "crear el canal" por donde enviar el correo.

En el campo ``host`` se utiliza el valor ``"smtp.ethereal.email"``, que es un host de prueba para desarrolladores.
Dependiendo del servicio que utilicemos, debemos utilizar los siguientes valores:

| Servicio | Host | Puertos | Seguridad |
|----------|------|---------|------------|
| Gmail | smtp.gmail.com | 587, 465 | TLS/SSL |
| Outlook/Hotmail | smtp.office365.com | 587 | TLS |
| Yahoo | smtp.mail.yahoo.com | 587, 465 | TLS/SSL |
| AOL | smtp.aol.com | 587 | TLS |
| SendGrid | smtp.sendgrid.net | 587 | TLS |
| Amazon SES | email-smtp.[región].amazonaws.com | 587, 465 | TLS/SSL |
| Mailgun | smtp.mailgun.org | 587 | TLS |
| Brevo (SendinBlue) | smtp-relay.sendinblue.com | 587 | TLS |
| Mailtrap (desarrollo) | smtp.mailtrap.io | 2525, 587 | TLS |
| Ethereal (pruebas) | smtp.ethereal.email | 587 | TLS |
| ProtonMail | smtp.proton.me | 587, 465 | TLS/SSL |
| Zoho Mail | smtp.zoho.com | 587, 465 | TLS/SSL |

Dependiendo del servicio que utilicemos, las propiedades de ``port`` y ``secure`` deberán de tener
un valor u otro (consultar **para cada servicio**)


En el apartado de `auth` nos piden el **usuario** y la **contraseña**. El campo `user` corresponde a la **dirección de correo** que envía el email:

> Ejemplo: mi.correo@hotmail.com

La `pass`, a la contraseña del correo. Para estos casos, está **altamente recomendado no utilizar
la password real asociada a ese correo**. Lo ideal es **crear una contraseña de aplicación**

Entra en el siguiente enlace:

> https://support.google.com/mail/answer/185833?hl=en

Y haz click en la opción: ``Create and manage your app passwords``.

> Nota: Es importante tener **la verificación en 2 pasos** o si no no podrá hacerse.

A continuación te pedirá **el nombre de la aplicación**. Para este ejemplo pondremos el nombre
_RateMyBusiness_

Luego aparecerá una ventana donde te indicará que **debes utilizar la contraseña de la aplicación en lugar de tu contraseña original desde la aplicación
que estés planeando utilizarla. NO** debes de cambiar tu contraseña original por la de la aplicación.

> ¿Por qué? ¿Qué ventajas tiene utilizar una contraseña de aplicación?
> 
> Huelga decir que **solo debe de hacerse este cambio cuando se pretenda que la cuenta de correo de Google sea utilizada por servicios de terceros**.
> 
> Las ventajas que ofrece este uso son:
> 1. Evitar que tu **contraseña original** quede expuesta. En nuestra api, en la parte de la contraseña asociada a la cuenta de correo, podremos utilizar la
> nueva contraseña creada, evitando así exponer la otra innecesariamente.
> 
> 2. Además, te permite añadir otros aspectos relacionados con la seguridad, como rastrear qué aplicación usa qué contraseña,
> cambiarlas, revocar las contraseñas (si en el peor de los casos han sido descubiertas), o utilizar la misma dirección de email pero con múltiples contraseñas
> de aplicación diferentes.
> 
> 3. Otras ventajas es que evita el uso de tokens y de su manejo (tener que refrescarlos), bloqueos por parte de Google y "salta" la 2FA de Google
> (la salta porque ésta contraseña en sí misma es un paso extra de seguridad).
> 
> Como apunte final, recordar que estas contraseñas de aplicación **solo están bien utilizarlas para casos donde necesitemos que una aplicación de terceros**

Así que ahora nuestro código quedaría así:


````javascript
function SendEmail(){
    const transporter = createTransport({
        host: process.env.HOST_EMAIL,
        port: process.env.SECURITY_PORT,
        secure: process.env.SECURE, // true for 465, false for other ports
        auth: {
            user: process.env.HOST_EMAIL,
            pass: process.env.HOST_EMAIL_PASSWORD,
        },
    });
}
````


Ahora que tenemos el ``transporter`` hecho, podemos **enviar** el email:

````
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

    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
        to: "bar@example.com, baz@example.com",
        subject: "Hello ✔",
        text: "Hello world?", // plain‑text body
        html: "<b>Hello world?</b>", // HTML body
    });
}
````

> 👉 Recuerda que en tu ``.env``, en la variable ``HOST_EMAIL_PASSWORD``, debes utilizar la **contraseña de aplicación** creada por Google, **no** tu contraseña real.

Cambiemos las props de ``from`` y ``to`` para enviarlos a nuestro correo de pruebas.


> ‼️ Si aparece un mensaje como este:
> ```
> {
>   "statusCode": 500,
>   "code": "EDNS",
>   "error": "Internal Server Error",
>   "message": "queryA EBADNAME smtp.gmail.com,"
> }
> ```
> 
> Significa que la propiedad de host dentro del método createTransport está recibiendo mal el valor. Asegúrate de que no le estés pasando 
> nada como una coma o algo parecido.

> ‼️️ Otro mensaje de error es:

```json
{
    "statusCode": 500,
    "code": "ESOCKET",
    "error": "Internal Server Error",
    "message": "009FFBFD01000000:error:0A00010B:SSL routines:ssl3_get_record:wrong version number:../deps/openssl/openssl/ssl/record/ssl3_record.c:355:\n"
}
```

> Esto puede ocurrir por varios motivos:
> 1. _No tienes activada la verificación en dos pasos en tu cuenta de Gmail_. Es necesario activar
> la verificación en dos pasos para poder utilizar la contraseña de aplicación. Además, debe de hacerse **antes** de 
> crear la contraseña de aplicación. Si ya la creaste, debes activar la verificación en dos pasos y volver a crear
> la contraseña de aplicación.
> 
> 2. _Tu contraseña original fue cambiada_. En el momento en que creaste la contraseña de aplicación, digamos que se "vincularon" tu
> contraseña de aplicación con la original. Si has cambiado la contraseña original **después** de generar la contraseña de aplicación, 
> **debes de volver a generar la contraseña de aplicación** para que funcione.
>


> Más documentación 👉 https://bestsoftware.medium.com/how-to-create-an-app-password-on-gmail-e00eff3af4e0


## 3.2 Middleware para la ruta: '/email'.

- Ahora mismo el correo se manda a la dirección por defecto que mandamos: 


```
await transporter.sendMail({
        from: process.env.TEST_EMAIL_FROM,
        to: process.env.TEST_EMAIL_TO,
        subject: "Hello ✔",
        text: "Hello world?", // plain‑text body
        html: "<b>Hello world?</b>", // HTML body
    });
```

- Así que vamos a crear un ``middleware`` donde comprobemos que los campos con los que queremos
personalizar los envíos de los emails llegan adecuadamente.


````
src/
└── email/
    └── middleware.ts
    └── routes.ts
````

Dentro de la carpeta ``email`` creamos el fichero ``middleware.ts``, donde lo desarrollaremos.

> 👉 Documentación: https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#validation

Para crear un middleware debemos añadir a la ruta que creamos anteriormente, correspondiente a ``/email``, un ``schema`` donde definir el ``body`` de la request:

````typescript

import {Middleware} from "./middleware";

export const RoutePostEmail = (server: FastifyInstance) => {
    server.post('/email', {schema: Middleware.FormBody() }, async (request, reply) => {
        const info = await SendEmail();
        reply.send({message: 'ok', info})
    })
}
````

Tras definir el nombre de la ruta (``/email``) añadimos un objeto que empiece con ``schema`` y en el que crearemos el ``body``.
Para tenerlo ordenado y organizado, crearemos este ``schema`` en el fichero ``middleware.ts`` que creamos anteriormente dentro de la carpeta
`/email`.

````ts
export const Middleware = {
    FormBody: FormBody
};

function FormBody(){
    return {
        body: {
            type: 'object',
            required: ['from, to, subject, text, html'],
            properties: {
                from: { type: 'string'},
                to: { type: 'string'},
                subject: { type: 'string'},
                text: { type: 'string'},
                html: { type: 'string'},
            }
        }
    }
}
````

Si ahora tratamos de enviar una petición a esta ruta, nos devolverán esta respuesta:

````json
{
    "statusCode": 400,
    "code": "FST_ERR_VALIDATION",
    "error": "Bad Request",
    "message": "body must be object"
}
````

### 3.2.1 Customizando el error

Como hemos visto anteriormente, Fastify devuelve un error por defecto cuando la validación de la ruta ha fallado (es decir, cuando no hemos añadido en el cuerpo de
la petición lo necesario para que esta se cumpla). Sin embargo, el error no es muy descriptivo:

```json
{
  "message": "body must be object"
}
```

Por suerte, Fastify **nos facilita** una manera de **personalizar** nuestros mensajes de error.

> 👉 https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#error-handling

Si añadimos en la configuración de la ruta la opción de `attachValidation: true`:

```js
const fastify = Fastify()

fastify.post('/', { schema, attachValidation: true }, function (req, reply) {
  if (req.validationError) {
    // `req.validationError.validation` contains the raw validation error
    reply.code(400).send(req.validationError)
  }
})
```

Podemos comprobar en la ``request`` si la validación falló. En nuestro código: 

````typescript
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
````

Si ahora hacemos una petición, esperando que ésta falle:

```json
{
  "message": "Error custom"
}
```

Veremos que, efectivamente, ésta falla.
