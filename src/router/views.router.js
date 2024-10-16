const { Router } = require('express')
const { ProductManagerMongo } = require("../daos/MONGO/productsManager.mongo");

const router = Router()

// Login - Register

router.get('/register', (req, res) => {
    res.render('register')
})
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/newpass', (req, res) => {
    res.render('changepass')
})

// Ruta para mostrar la lista de productos
router.get('/', (req, res) => {
    res.render('index', {})
})

// Ruta para mostrar los productos paginados
router.get('/productos', async (req, res) => {
    const productService = new ProductManagerMongo()
    const { limit, pageNum } = req.query
    try {
        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        } = await productService.getProductos({ limit, page: pageNum })

        res.render('products', {
            products: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        })
    } catch (error) {
        console.log(error)
    }
})

// Ruta para mostrar un producto
router.get('/home', (req, res) => {
    const productService = new ProductManagerMongo()
    const products = productService.getProductos()
    res.render('home', { products })
})

// Ruta para mostrar los productos en tiempo real (con websockets)
router.get('/realtimeproducts', async (req, res) => {

    res.render('realtimeproducts', {})

})

// Ruta para mostrar los carritos
router.get('/carts', async (req, res) => {
    const productService = new ProductManagerMongo()
    const { limit, pageNum } = req.query
    try {
        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        } = await productService.getProductos({ limit, page: pageNum })

        res.render('carts', {
            products: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router