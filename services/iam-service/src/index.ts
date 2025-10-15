import 'reflect-metadata'
import {
    ServerBuilder
} from '@mangojs/core'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerJson from '../docs/swagger.api.json'

import { services } from '@mangojs/core'

dotenv.config()

///////////////////
// VARIABLES

// set microservice port
const PORT = Number(process.env.PORT) || 3001

// set express cors options
let corsOptions = {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
}

// cors
const corsOriginFunction = function (origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    if (corsOptions.allowedOrigins.indexOf(origin) === -1) {
        var msg =
            'The CORS policy for this site does not ' +
            'allow access from the specified Origin.'
        return callback(new Error(msg), false)
    }
    return callback(null, true)
}

///////////////////
// PREPARE SERVER
const applicationServer = new ServerBuilder()
    .setName('iam-service')
    .setPort(PORT)
    .setRoutes(services.iam_server.routes.routes)
    .setUserAuthentication(true)
    .enableSwagger(true)
    .setSwaggerSpec(swaggerJSDoc(swaggerJson))
    .expressUse(helmet())
    .expressUse(
        cors({
            origin: corsOriginFunction,
            credentials: corsOptions.credentials,
        })
    )
    .expressUse(cookieParser())
    .build() // build

///////////////////
// START SERVER
applicationServer
    .then((appExpress) => { 
        appExpress.run()
    })
    .catch((err) => {
        console.log({ err }, 'ERROR STARTING SERVER')
    })
