import {
    Auth,
    INVERSITY_TYPES,
    Loggers,
    CockroachPersistenceContext,
    databasemanager,
} from '@mangojs/core'
import { IPersistenceContext } from '@mangojs/core'
import { IDatabaseManagerFactory } from '@mangojs/core'

import { services } from '@mangojs/core'

//import { Containers } from '@mangojs/core'
import { Container } from 'inversify'

//const DefaultContainer:Container = Containers.getContainer() as unknown as Container
const POSTGRES_PASSWORD = process.env.DATABASE_PASSWORD || ''
const POSTGRES_USER = process.env.DATABASE_USER || ''
const POSTGRES_DB = process.env.DATABASE_DB || ''

const DefaultContainer:Container = services.iam_server.IAMDefautContainer as unknown as Container

/**
 * Bind Logger Service
 */
DefaultContainer.bind<Loggers.ILoggerFactory>(
    INVERSITY_TYPES.LoggerFactory
).toConstantValue(new Loggers.LoggerPino('iam-service', process.env.LOG_LEVEL || 'debug'))


/**
 * Bind Database connector - Supabase
 * Configure via environment variables
 */
DefaultContainer.bind<IDatabaseManagerFactory>(
    INVERSITY_TYPES.DatabaseManagerFactory
).toConstantValue(
    new databasemanager.postgres.PostgresDBManagerFactory(
        {
            username: POSTGRES_USER,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DB,
            host: process.env.DATABASE_HOST || 'localhost',
            port: Number(process.env.DATABASE_PORT) || 5432,
        },
        [
            services.iam_server.models.AdminUser,
            services.iam_server.models.PartnerUser,
            services.iam_server.models.Group
        ]
    )
)

/**
 * Bind Persistance Context - CockroachDB
 */
DefaultContainer.bind<IPersistenceContext>(
    INVERSITY_TYPES.PersistenceContext
).to(CockroachPersistenceContext)

/**
 * Bind Authorization Context
 */
DefaultContainer.bind<Auth.IAuthProvider>(
    INVERSITY_TYPES.AuthorizationContext
).to(services.iam_server.services.AuthorizationService)

export { DefaultContainer }
