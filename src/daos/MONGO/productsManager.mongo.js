const { productModel } = require("../../models/products.model");

class ProductManagerMongo {
  constructor() {
    this.model = productModel;
  }

  //Mostramos todos los productos de la BD
  getProducts = async () => {
    try {
      const products = await this.model.find({});
      return products;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  //Mostramos todos los productos de la BD con paginación
  getProductos = async ({ limit = 2, page = 1, opts = {} } = {}) => {
    try {
      const products = await this.model.paginate(opts, { limit, page, lean: true });
      return products;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  //Mostramos productos selecciondos por ID
  getProductById = async (id) => {
    try {
      return await this.model.findOne({ _id: id });
    } catch (error) {
      console.log("Error en getProduct:", error);
      return null;
    }
  };

  //Creamos un producto en la BD

  
  createProducts = async (addProducts) => {
    if (!Array.isArray(addProducts)) {
      addProducts = [addProducts]; // Asegúrate de que sea un arreglo
  }

  const results = [];

  for (const addProduct of addProducts) {
      if (
          !addProduct.title ||
          !addProduct.code ||
          !addProduct.price ||
          !addProduct.stock ||
          !addProduct.category ||
          !addProduct.thumbnail
      ) {
          console.log("Producto incompleto:", addProduct);
          results.push({ status: "error", message: "Producto incompleto", product: addProduct });
          continue; // Salta a la siguiente iteración
      }

      try {
          const product = await this.model.create(addProduct);
          results.push({ status: "success", product });
      } catch (error) {
          console.log(error);
          results.push({ status: "error", message: "Error al crear el producto", product: addProduct });
      }
  }

  return results; // Devuelve todos los resultados
}

  //Modificamos un producto por ID
  updateProducts = async (modProduct) => {
    try {
      const updatedProduct = await this.model.findByIdAndUpdate(
        modProduct.id,
        modProduct,
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  //Eliminamos un poroducto por ID
  deleteProducts = async (delProductId) => {
    try {
      const result = await this.model.findByIdAndDelete(delProductId);
      if (result) {
        return { message: "Producto eliminado con éxito" };
      } else {
        return { message: "Producto no encontrado" };
      }
    } catch (error) {
      console.log(error);
      return { message: "Error al eliminar el producto" };
    }
  };
}

module.exports = {
  ProductManagerMongo,
};
