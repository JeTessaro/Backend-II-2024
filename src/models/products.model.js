const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

//Creamos la collection en la BD
const collectionName = 'products'

//Creamos el esquema del producto con sus propiedades
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    thumbnail: String,
    price: Number,
    stock: Number,
    category: {
        type: String,
        required: true
    },
    create: {
        type: Date,
        default: Date.now()
    }
})

productSchema.plugin(mongoosePaginate)
const productModel = model(collectionName, productSchema)

module.exports = { productModel }