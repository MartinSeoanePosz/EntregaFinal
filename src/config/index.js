import { PORT, MAILER, COOKIESECRET, db } from './indexconfig.js'
import { specs }  from './swaggerconfig.js'
import sessionConfig from './sessionconfig.js'
import initializePassport from './passportconfig.js';
import gitHubPassport from './gitHubPassport.js';
import connectMongo from './databaseconfig.js'

export { PORT, MAILER, COOKIESECRET, specs, db, sessionConfig, initializePassport, gitHubPassport, connectMongo }