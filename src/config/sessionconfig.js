import session from 'express-session';
import MongoStore from 'connect-mongo';
import { COOKIESECRET, db } from './indexconfig.js';

const sessionConfig = session({
  store:  MongoStore.create({
    mongoUrl: `mongodb+srv://${db.user}:${db.pass}@${db.host}/${db.name}`,
    ttl: 600,
  }),
  secret: COOKIESECRET,
  resave: false,
  saveUninitialized: true,
});

export default sessionConfig;