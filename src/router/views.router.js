const { Router } = require('express');
const { ProductDaoMongo } = require('../daos/MONGO/productsDao.mongo');
const { productModel } = require('../daos/MONGO/models/products.model');
const isAuthenticated = require('../middleware/autenticarMaill');



const router = Router();

// Login - Register
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/newpass', (req, res) => {
    res.render('changepass');
});

// Ruta para mostrar la lista de productos
router.get('/', (req, res) => {
    res.render('index', {});
});

// Ruta para mostrar los productos paginados
router.get('/productos', async (req, res) => {
    const productService = new ProductDaoMongo();
    const { limit = 5, pageNum = 1 } = req.query;
    try {
        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        } = await productService.get({ limit, page: pageNum });

        res.render('products', {
            products: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los productos.");
    }
});

// Ruta para mostrar un producto
router.get('/home', async (req, res) => {
    const productService = new ProductDaoMongo();
    try {
        const products = await productService.get();
        res.render('home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los productos para la página de inicio.");
    }
});

// Ruta para mostrar productos en tiempo real (con websockets)
router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts', {});
});

// Ruta para mostrar los carritos
router.get('/carts', async (req, res) => {
    const productService = new ProductDaoMongo();
    const { limit = 2, pageNum = 1 } = req.query;

    try {
        const {
            docs,
            totalDocs,
            totalPages,
            page
        } = await productService.get({ limit, page: pageNum });

        res.render('carts', {
            products: docs,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            totalDocs,
            totalPages
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }


});




module.exports = router;
