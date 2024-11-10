const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

//Creamos la collection en la BP
const collectionName = 'carts'

//Creamos el esquema del carrito con sus propiedades
const cartsSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    cant: {
        type: Number,
        required: true
    },
    create: {
        type: Date,
        default: Date.now()
    },
    userEmail: { 
        type: String,  
        required: true 
    },
    products: [{
        code: String,
        cant: Number
    }]
})

cartsSchema.plugin(mongoosePaginate)
const cartsModel = model(collectionName, cartsSchema)

module.exports = { cartsModel }