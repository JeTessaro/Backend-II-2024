const { cartsModel } = require("../../models/carts.model");


class CartsManagerMongo {
  constructor() {
    this.model = cartsModel;
  }
  // Mostramos todo el contenido de la BD
  getCarts = async () => {
    try {
      const carts = await this.model.find({});
      return carts;
    } catch (error) {
      console.log("Error en getCarts:", error);
      return [];
    }
  };

  // Mostramos todo el contenido de la BD con paginación
  getCart = async ({ limit = 2, page = 1, opts = {} } = {}) => {
    try {
      const cart = await this.model.paginate(opts, { limit, page, lean: true });
      return cart;
    } catch (error) {
      console.log("Error en getCart:", error);
      return [];
    }
  };

  // Buscar el producto por su ID
  getCartsId = async (productId) => {
    try {
      const product = await this.model.findById(productId);
      return product || null;
    } catch (error) {
      console.log("Error en getCartsId:", error);
      return null;
    }
  };

  // Añadir un nuevo producto al carrito

  createCarts = async (newCarts) => {
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

  updateCarts = async (cid, newProduct) => {
    try {
      // Buscamos el carrito por ID
      const cart = await cartsModel.findById(cid);

      if (!cart) {
        return null;
      }

      // Verificamos si el carrito ya tiene el producto
      if (cart.code === newProduct.code) {

        cart.price = newProduct.price;
        cart.cant = newProduct.cant;
      } else {
        return null;
      }

      await cart.save();
      return cart;

    } catch (error) {
      console.log(error);
      return null;
    }
  };


  //

  deleteCarts = async (delCartsId) => {
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
}

module.exports = {
  CartsManagerMongo,
};