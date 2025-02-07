import express from 'express';
import path from 'path';
import { __dirname } from './path.js';
import { create } from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import sessionRouter from './routes/sessions.routes.js';
import viewsRouter from './routes/views.router.js';

const app = express();
const PORT = 8080;
const handlebars = create();
const DBPATH = 'mongodb+srv://rodrigogigena2611:@cluster0.s1wg4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({ 
        mongoUrl: DBPATH,
        mongoOptions: {},
        ttl: 15,
    }),
    secret: 'secretSession',
    resave: true,
    saveUninitialized: true
}))

app.get('/setCookie', (req, res)  => {
    res.status(200).cookie('myCookie', 'firstCookie', {maxAge: 100000}).send('Cookie creada')
})

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionRouter)
app.use('/', viewsRouter);
app.get('/', (req, res) => {
    res.status(200).redirect('/home');
});

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});
const io = new Server(httpServer);

const connectMongoDB = async () => {
    try {
        await mongoose.connect(DBPATH)
        console.log("Conectado a la base de datos")
        
    } catch (error) {
        console.log("Error al conectarse", error)
    }
}
connectMongoDB();

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('product-added', (product) => {
        console.log('Nuevo producto recibido:', product);
        io.emit('product-added', product);
    });
});
