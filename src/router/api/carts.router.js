const { Router } = require("express");
const { CartsManagerMongo } = require("../../daos/MONGO/cartsManager.mongo");
const Cart = require('../../models/carts.model'); 


const router = Router();
const cartsService = new CartsManagerMongo();

// Obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await cartsService.getCarts();
    res.send({ status: "Success", payLoad: carts });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Error", message: "Error al obtener los carritos" });
  }
});

// Crear un nuevo carrito
router.post("/post", async (req, res) => {
  try {
    const carts = req.body;

    // Validamos que sea un array y que no esté vacío
    if (!Array.isArray(carts) || carts.length === 0) {
      return res.status(400).send({ status: "Error", message: "Se espera un array de productos" });
    }

    // Validamos producto en el array
    for (const item of carts) {
      const { code, price, cant } = item;
      if (!code || !price || !cant) {
        return res.status(400).send({ status: "Error", message: "Los campos code, price y cant son obligatorios para cada producto" });
      }
    }

    // Procesar cada producto 
    const response = await cartsService.createCarts(carts);

    if (response) {
      res.send({ status: "Success", payLoad: response });
    } else {
      res.status(400).send({ status: "Error", message: "No se pudo crear el carrito" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Error", message: "Error al crear el carrito" });
  }
});

//Mostramos productos del carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const product = await cartsService.getCartsId(cid);

    if (!product) {
      return res.status(404).send({ status: "Error", message: "Producto no encontrado" });
    }

    res.send({ status: "Success", payLoad: product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Error", message: "Error al obtener el producto" });
  }
});

//Modificamos el carrito
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { code, price, cant } = req.body;


    const result = await cartsService.updateCarts(cid, { code, price, cant });

    if (!result) {
      return res.status(404).send({ status: "Error", message: "Carrito no encontrado" });
    }

    res.send({ status: "Success", message: "Producto actualizado" });

  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Error", message: "Error al actualizar el carrito" });
  }
});




// Eliminar un carrito por ID
router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const result = await cartsService.deleteCarts(cartId);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Error", message: "Error al eliminar el carrito" });
  }
});

module.exports = router;
