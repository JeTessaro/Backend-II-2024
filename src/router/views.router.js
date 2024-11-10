const { Router } = require('express');
const { ProductDaoMongo } = require('../daos/MONGO/productsDao.mongo');

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
    const { limit = 10, pageNum = 1 } = req.query; // Valores por defecto
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
        const products = await productService.get(); // Asegúrate de que esto sea asíncrono
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

module.exports = router;
