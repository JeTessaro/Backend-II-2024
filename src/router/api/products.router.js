const { Router } = require("express");
const { ProductManagerMongo } = require("../../daos/MONGO/productsManager.mongo.js");

const router = Router();
const productService = new ProductManagerMongo();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.send({ status: "Success", payLoad: products });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Error", message: "Error al obtener productos" });
  }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { body } = req;
    const response = await productService.createProducts(body);
    res.send({ status: "Success", payLoad: response });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Error", message: "Error al crear el producto" });
  }
});

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productService.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error del servidor");
  }
});

// Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
  try {
    res.send("Put ID de Productos");
  } catch (error) {
    console.log(error);
  }
});

// Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  try {
    res.send("Delete ID de Productos");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
