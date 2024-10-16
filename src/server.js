const express = require('express')
const handlebars = require('express-handlebars')
const appRouter = require('./router/index.js')
const { connectDB } = require('./config/index.js')
const path = require('path')
const http = require('http');
const { Server } = require('socket.io');
const { ProductManagerMongo } = require('./daos/MONGO/productsManager.mongo.js')
const mongoose = require('mongoose');
const cookie = require('cookie-parser')
//const cookieParser = require('express-session')
//const { session } = require('passport')
const viewsRouter   = require('./router/views.router.js')
const pruebaRouter = require('./router/pruebas.router.js')

// clase cookie session 
const cookieParser = require('cookie-parser')
const session      = require('express-session')
const sessionsRouter = require('./router/api/sessions.router.js')

//Session file
const FileStore = require('session-file-store')
const MongoStore = require('connect-mongo')

//Passport
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')




const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => {
    console.log('eEscuchando en el puerto : ', PORT);
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


// // Configuración de Session con File

// const fileStore = new FileStore(session)
// app.use(session({
//     store: new fileStore({
//         path: './session',
//         ttl: 10,
//         retire: 0
//     }),
//     secret: 'secretcoder',
//     resave: true,
//     saveUninitialized: true
// }))

//Configuracion de Session con Mongo
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://hemy1605:101Dalmatas@cluster0.pxtmf5z.mongodb.net/c70130?retryWrites=true&w=majority&appName=Cluster0',
        // mongoOptions: {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // },
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
        const { getProducts, createProducts } = new ProductManagerMongo();
        const products = await getProducts();
        socket.emit('productList', products);

        socket.on('addProduct', async (data) => {
            await createProducts(data);
            const updatedProducts = await getProducts();
            io.emit('productList', updatedProducts);
        });
        // Manejar la eliminación de productos
        socket.on('deleteProduct', async (id) => {
            try {
                const productId = new mongoose.Types.ObjectId(id);
                const productManager = new ProductManagerMongo();
                const response = await productManager.deleteProducts(productId);
                console.log(response.message);
                const updatedProducts = await productManager.getProducts();
                io.emit('productList', updatedProducts);
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                socket.emit('error', { message: 'Error al eliminar el producto' });
            }
        });



    });
};

productSocket(io)