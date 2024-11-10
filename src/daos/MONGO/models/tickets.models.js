const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const collectionName = 'ticket';

// Creamos el esquema del ticket con sus propiedades
const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    amount_number: {
        type: Number,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    userEmail: {
        type: String,
        required: true
    },
    products: [{
        code: String,
        cant: Number
    }]
});

ticketSchema.plugin(mongoosePaginate);
const ticketModel = model(collectionName, ticketSchema);

module.exports = { ticketModel };
