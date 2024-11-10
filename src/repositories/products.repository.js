class ProductRepository {
    constructor(productDao) {
        this.productDao = productDao
    }
    getProducts = async () => await this.productDao.get()
    createProducts = async (addProducts) => await this.productDao.create(addProducts)
    getProductsById = async (productId) => {
        return await this.productDao.getById(productId)
    }
    updateProducts = async (productId, updatedData) => {
        return await this.productDao.update({ id: productId, ...updatedData })
    }
    deleteProducts = async (productId) => {
        return await this.productDao.delete(productId)
    }
}

module.exports = ProductRepository