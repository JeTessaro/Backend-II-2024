const express = require('express');
const { productService } = require('../services');

class ProductsController {
    constructor() {
        this.productService = productService;
    }

    getProducts = async (req, res) => {
        try {
            const products = await productService.getProducts();
            res.send({ status: "Success", payLoad: products });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Error", message: "Error al obtener productos" });
        }
    };

    getProductsById = async (req, res) => {
        try {
            const productId = req.params.pid;
            const product = await this.productService.getProductsById(productId);

            if (product) {
                res.json(product);
            } else {
                res.status(404).send("Producto no encontrado");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Error del servidor");
        }
    }

    createProducts = async (req, res) => {
        try {
            const { body } = req;
            const response = await productService.createProducts(body);
            res.send({ status: "Success", payLoad: response });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Error", message: "Error al crear el producto" });
        }
    }
    updateProducts = async (req, res) => {
        try {
            const productId = req.params.pid;
            const updatedData = req.body;


            const updatedProduct = await this.productService.updateProducts(productId, updatedData);

            if (updatedProduct) {
                res.send({ status: "Success", payLoad: updatedProduct });
            } else {
                res.status(404).send({ status: "Error", message: "Producto no encontrado" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Error", message: "Error al actualizar el producto" });
        }
    };

    deleteProducts = async (req, res) => {
        try {
            const productId = req.params.pid;


            const result = await this.productService.deleteProducts(productId);

            if (result) {
                res.status(200).send({ status: "Success", message: "Producto eliminado correctamente" });
            } else {
                res.status(404).send({ status: "Error", message: "Producto no encontrado" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: "Error", message: "Error al eliminar el producto" });
        }
    }
}
module.exports = {
    ProductsController
}
