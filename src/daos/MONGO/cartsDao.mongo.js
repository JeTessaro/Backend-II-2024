const mongoose = require('mongoose');
const { cartsModel } = require("./models/carts.model");


class CartsManagerMongo {
  constructor() {
    this.model = cartsModel;
  }

  // Mostramos todo el contenido de la BD con paginación
  get = async ({ limit = 10, page = 1, opts = {} } = {}) => {
    try {
      const cart = await this.model.paginate(opts, { limit, page, lean: true });
      return cart;
    } catch (error) {
      console.log("Error en getCart:", error);
      return [];
    }
  };

  // Buscar el producto por su ID
  getById = async (productId) => {
    try {
      const product = await this.model.findById(productId);
      return product || null;
    } catch (error) {
      console.log("Error en getCartsId:", error);
      return null;
    }
  };

  // Añadir un nuevo producto al carrito

  create = async (newCarts) => {
    // Validamos que newCarts sea un array y que no esté vacío
    if (!Array.isArray(newCarts) || newCarts.length === 0) {
      console.log("Producto incompleto o formato incorrecto");
      return "Producto incompleto o formato incorrecto";
    }

    // Validamos cada producto en el array
    for (const item of newCarts) {
      if (!item.code || !item.cant || typeof item.price === 'undefined') {
        console.log("Producto incompleto:", item);
        return "Producto incompleto";
      }
    }

    try {
      // Creamos los carritos en la base de datos
      const carts = await this.model.insertMany(newCarts);
      return carts;
    } catch (error) {
      console.log("Error al crear el carrito:", error);
      return null;
    }
  };

  update = async (cartId, updateData) => {
    try {
      // Asegúrate de que cartId sea un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error("ID de carrito inválido");
      }

      const result = await this.model.findByIdAndUpdate(cartId, updateData, { new: true });
      return result;
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw error; // Propaga el error para manejarlo en el controlador
    }
  };
  //

  delete = async (delCartsId) => {
    try {
      const result = await this.model.findByIdAndDelete(delCartsId);
      if (result) {
        return { message: "Producto eliminado con éxito" };
      } else {
        return { message: "Producto no encontrado" };
      }
    } catch (error) {
      console.log("Error al eliminar el producto:", error);
      return { message: "Error al eliminar el producto" };
    }
  };

  getCartsByEmail = async (userEmail) => {
    try {
      const carts = await this.model.find({ userEmail });
      console.log(carts)
      return carts;
    }
    catch (error) {
      console.error("Error al obtener carritos por email:", error);
      throw new Error("Error al obtener carritos por email");
    }
  };
}

module.exports = {
  CartsManagerMongo,
};