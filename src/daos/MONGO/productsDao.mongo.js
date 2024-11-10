const { productModel } = require("./models/products.model");

class ProductDaoMongo {
  constructor() {
    this.model = productModel;
  }

  //Mostramos todos los productos de la BD con paginación
  get = async ({ limit = 2, page = 1, opts = {} } = {}) => {
    try {
      const result = await this.model.paginate(opts, { limit, page, lean: true });
      return {
        docs: result.docs,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
      };
    } catch (error) {
      console.log(error);
      return { docs: [], totalDocs: 0, totalPages: 0, page: 0 };
    }
  };


  //Mostramos productos selecciondos por ID
  getById = async (id) => {
    try {
      return await this.model.findOne({ _id: id });
    } catch (error) {
      console.log("Error en getProduct:", error);
      return null;
    }
  };

  //Creamos un producto en la BD

  create = async (addProducts) => {
    if (!Array.isArray(addProducts)) {
      addProducts = [addProducts];
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
        continue;
      }

      try {
        const product = await this.model.create(addProduct);
        results.push({ status: "success", product });
      } catch (error) {
        console.log(error);
        results.push({ status: "error", message: "Error al crear el producto", product: addProduct });
      }
    }

    return results;
  }

  //Modificamos un producto por ID
  update = async (modProduct) => {
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
  delete = async (productId) => {
    try {
      const result = await this.model.findByIdAndDelete(productId);
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

  getByCode = async (code) => {
    try {
      const product = await this.model.findOne({ code });
      return product || null;
    } catch (error) {
      console.error("Error al obtener producto por código:", error);
      throw new Error("Error al obtener producto por código");
    }
  }
}

module.exports = {
  ProductDaoMongo,
};
