const express = require('express')
const handlebars = require('express-handlebars')
const appRouter = require('./router/index.js')
const { connectDB, configObject } = require('./config/index.js')
const path = require('path')
const http = require('http');
const { Server } = require('socket.io');
const { ProductDaoMongo } = require('./daos/MONGO/productsDao.mongo.js')
const mongoose = require('mongoose');
const cookie = require('cookie-parser')
const viewsRouter = require('./router/views.router.js')
const pruebaRouter = require('./router/pruebas.router.js')

// clase cookie session 
const cookieParser = require('cookie-parser')
const session = require('express-session')
const sessionsRouter = require('./router/api/sessions.router.js')

//Session file
const FileStore = require('session-file-store')
const MongoStore = require('connect-mongo')

//Passport
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')




const app = express()
const PORT = configObject.port
const httpServer = app.listen(PORT, () => {
    console.log('Escuchando en el puerto configObject: ', PORT);
})

const ioMiddleware = (io) => (req, res, next) => {
    res.io = io;
    next();
}

const io = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + 'public'))

app.use(cookieParser('palabrasecreta'))

// Configuración de Passport jwt
initializePassport()
app.use(passport.initialize())

//Configuración de Session en memoria
app.use(session({
    secret: 'secretcoder',
    resave: true,
    saveUninitialized: true
}))

//Configuracion de Session con Mongo
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://hemy1605:101Dalmatas@cluster0.pxtmf5z.mongodb.net/c70130?retryWrites=true&w=majority&appName=Cluster0',
        ttl: 100000000000
    }),
    secret: 'secretcoder',
    resave: false,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

connectDB()

app.use(appRouter)

app.use('/pruebas', pruebaRouter)
app.use(session({
    secret: 'secretcoder',
    resave: true,
    saveUninitialized: true
}))

app.use('/api/sessions', sessionsRouter)

// Definición de la función productSocket antes de usarla
const productSocket = (io) => {
    io.on('connection', async (socket) => {
        console.log('Nuevo cliente conectado');
        const { get, create } = new ProductDaoMongo();


        const sendProductList = async (page = 1, limit = 2) => {
            try {
                const result = await get({ page, limit });
                socket.emit('productList', result.docs);
                socket.emit('paginationInfo', {
                    totalDocs: result.totalDocs,
                    totalPages: result.totalPages,
                    currentPage: result.page,
                });
            } catch (error) {
                console.error("Error al obtener productos:", error);
                socket.emit('productList', []);
            }
        };

        // Enviar la lista inicial de productos
        await sendProductList();

        socket.on('addProduct', async (data) => {
            await create(data);
            await sendProductList();
        });

        socket.on('deleteProduct', async (id) => {
            try {
                const productId = new mongoose.Types.ObjectId(id);
                const productManager = new ProductDaoMongo();
                const response = await productManager.delete(productId);
                console.log(response.message);
                await sendProductList();
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                socket.emit('error', { message: 'Error al eliminar el producto' });
            }
        });

        // Manejar solicitud de paginación
        socket.on('requestPage', async (page) => {
            await sendProductList(page);
        });
    });
};

productSocket(io);
