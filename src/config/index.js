const { connect } = require('mongoose');
const productModel = require('../models/products.model.js');
const cartsModel = require('../models/carts.model.js')
const userModel = require('../models/users.model.js')

module.exports.connectDB = async () => {
    try {
        await connect('mongodb+srv://hemy1605:101Dalmatas@cluster0.pxtmf5z.mongodb.net/c70130?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Base de datos conectada');

       
        // const resultado = await productModel.aggregate([
        //     {
        //         $match: {
        //             category: "Línea Clásica"
        //         }
        //     },
        //     {
        //        $group: {
        //             _id: "$code",
        //             total: {
        //                 $sum: "$stock"
        //             }
        //        }  
        //     },

        //     {
        //         $sort: {
        //             total: 1
        //         }
        //     },

        //     {
        //         $group: {
        //             _id: 1,
        //             orders: {
        //                 $push: "$$ROOT"
        //             }
        //         }
        //     },

        //     {
        //         $project: {
        //             _id: 1,
        //             orders: "$orders"
        //         }
        //     },

        //     {
        //         $merge: {
        //             into: "reports"
        //         }
        //     }

        // ])

        // console.log(resultado)
    

    } catch (error) {
        console.error('Error al conectar a la base de datos o al buscar productos:', error);
    }
};

const main = async () => {
    await module.exports.connectDB();
};

main();
