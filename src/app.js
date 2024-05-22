import express from 'express';
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import swaggerUiExpress from 'swagger-ui-express';
import { PORT, COOKIESECRET, sessionConfig, initializePassport, gitHubPassport, connectMongo, specs } from './config/index.js';
import { handleChatSocketEvents } from './sockets/socketEvents.js';
import { productRouter, cartRouter, viewsRouter, loginRouter, signupRouter, sessionRouter, mockingRouter, loggerTest, forgotPasswordRouter, usersRouter, documentsRouter } from './routes/index.js';
import { auth, addLogger } from './middleware/index.js';
import { __dirname } from './fileUtils.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIESECRET));
app.use(sessionConfig);

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(addLogger);

initializePassport();
gitHubPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/users",usersRouter)
app.use("/", viewsRouter);
app.use("/", sessionRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/mockingproducts", mockingRouter);
app.use("/loggerTest", loggerTest);
app.use("/forgotpassword", forgotPasswordRouter)
app.use("/", documentsRouter)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(auth);

const server = app.listen(PORT, () => {
});

const socketServer = new Server(server);

socketServer.on('connection', (socket) => {
  handleChatSocketEvents(socket);
});


connectMongo();