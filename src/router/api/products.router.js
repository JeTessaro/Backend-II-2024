const { Router } = require("express");
const { ProductsController } = require("../../controllers/products.controller.js");

const router = Router();

// Productos

const {
  getProducts,
  createProducts,
  updateProducts,
  deleteProducts,
  getProductsById
} = new ProductsController();

// Obtener todos los productos
router.get("/", getProducts)

// Crear un nuevo producto
router.post("/", createProducts)

// Obtener un producto por ID
router.get("/:pid", getProductsById);

// Actualizar un producto por ID
router.put("/:pid", updateProducts);

// Eliminar un producto por ID
router.delete("/:pid", deleteProducts);

module.exports = router;
