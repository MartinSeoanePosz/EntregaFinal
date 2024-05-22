import dotenv from 'dotenv'

dotenv.config()

const MAILER = {
    service: process.env.MAILER_SERVICE,
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS
}


const PORT = process.env.PORT || 8080

const db = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME
}

const COOKIESECRET = process.env.COOKIESECRET

export { PORT, MAILER, db, COOKIESECRET }