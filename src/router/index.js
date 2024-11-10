const { Router } = require('express')
const usersRouter = require('./api/users.router.js')
const productRouter = require('./api/products.router.js')
const cartsRouter = require('./api/carts.router.js')
const viewRouter = require('./views.router.js')
const { uploader } = require('../utils/uploader.js')
const viewsRouter = require('./views.router.js')
const sessionsRouter = require('./api/sessions.router.js')

const router = Router()

// Upload de archivos
router.post('/', uploader.single('myFile'), (req, res) => {
    res.send('archivo subido')
})

// Rutas API
router.use('/', viewsRouter)
router.use('/api/users', usersRouter)
router.use('/api/products', productRouter)
router.use('/api/carts', cartsRouter)
router.use('/api/sessions', sessionsRouter)
router.use('/api/messages', () => { })


module.exports = router
