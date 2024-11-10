const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'user_premium', 'admin']
    },
    password:{
        type: String,
        required: true
    },
    cartID: {
        type: Schema.Types.ObjectId,
        ref: 'Carts'
      },
    atCreated: {
        type: Date,
        default: Date()
    }
})

const userModel = model('users', userSchema)

module.exports = {
    userModel
}