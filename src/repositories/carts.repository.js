const mongoose = require('mongoose');
class CartsRepository {
    constructor(cartDao) {
        this.cartDao = cartDao;
    }

    getCarts = async () => await this.cartDao.get();

    createCarts = async (addCarts) => await this.cartDao.create(addCarts);

    getCartsById = async (cartId) => {
        return await this.cartDao.getById(cartId);
    };

    updateCarts = async (cartId, updatedData) => {

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error("ID de carrito inválido");
        }
        return await this.cartDao.update(cartId, updatedData);
    };

    deleteCarts = async (cartId) => {

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error("ID de carrito inválido");
        }
        return await this.cartDao.delete(cartId);
    };

    createTicket = async (cartId) => {

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw new Error("ID de carrito inválido");
        }
    };

    getCartsByEmail = async (email) => {
        console.log('email del getcarts', email)
        try {
            return await this.cartDao.getCartsByEmail(email);
        } catch (error) {
            console.error("Error al obtener carritos por email:", error);
            throw new Error("Error al obtener carritos");
        }
    };

}

module.exports = CartsRepository;
