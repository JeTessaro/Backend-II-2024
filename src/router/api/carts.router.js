const { Router } = require("express");
const { CartsController } = require("../../controllers/carts.controllers");

const router = Router();


const {
  getCarts,
  createCarts,
  getCartsById,
  updateCarts,
  deleteCarts,
  createTicket
} = new CartsController(); 

// Obtener todos los carritos
router.get("/", getCarts);

// Crear un nuevo carrito
router.post("/post", createCarts);

//Mostramos productos del carrito por ID
router.get("/:cid", getCartsById );

//Modificamos el carrito
router.put("/:cid", updateCarts);

// Eliminar un carrito por ID
router.delete("/:cid", deleteCarts);

// Finalizar el proceso
router.post("/purchase", createTicket);

module.exports = router;
