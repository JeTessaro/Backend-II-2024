const { CartsManagerMongo }  = require("../daos/MONGO/cartsDao.mongo");
const { ProductDaoMongo }    = require("../daos/MONGO/productsDao.mongo");
const UserDaoMongo           = require("../daos/MONGO/usersDao.mongo");
const CartsRepository        = require("../repositories/carts.repository");
const ProductRepository      = require("../repositories/products.repository");
const UsersRepository        = require("../repositories/users.repository");

const userService       = new UsersRepository(new UserDaoMongo())
const productService    = new ProductRepository(new ProductDaoMongo())
const cartsService      = new CartsRepository(new CartsManagerMongo())



module.exports = {
    userService,
    productService,
    cartsService
}