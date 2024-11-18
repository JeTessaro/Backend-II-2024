const express = require('express');
const { cartsService } = require('../services');
const { ticketModel: Ticket } = require('../daos/MONGO/models/tickets.models');
const { ProductDaoMongo } = require('../daos/MONGO/productsDao.mongo');
const nodemailer = require('nodemailer');
const { configObject } = require('../config');

class CartsController {
  constructor() {
    this.cartsService = cartsService;
  }

  getCarts = async (req, res) => {
    try {
      const carts = await this.cartsService.getCarts();
      res.send({ status: "Success", payLoad: carts });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Error", message: "Error al obtener los carritos" });
    }
  }

  getCartsById = async (req, res) => {
    try {
      const { cid } = req.params;
      const product = await this.cartsService.getCartsById(cid);

      if (!product) {
        return res.status(404).send({ status: "Error", message: "Producto no encontrado" });
      }

      res.send({ status: "Success", payLoad: product });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Error", message: "Error al obtener el producto" });
    }
  }

  createCarts = async (req, res) => {
    try {
      const carts = req.body;


      if (!Array.isArray(carts) || carts.length === 0) {
        return res.status(400).send({ status: "Error", message: "Se espera un array de productos" });
      }


      for (const item of carts) {
        const { code, price, cant } = item;
        if (!code || !price || !cant) {
          return res.status(400).send({ status: "Error", message: "Los campos code, price y cant son obligatorios para cada producto" });
        }
      }


      const response = await this.cartsService.createCarts(carts);

      if (response) {
        res.send({ status: "Success", payLoad: response });
      } else {
        res.status(400).send({ status: "Error", message: "No se pudo crear el carrito" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Error", message: "Error al crear el carrito" });
    }
  }

  updateCarts = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const { code, price, cant } = req.body;


      const updateData = { code, price, cant };

      const updatedCart = await this.cartsService.updateCarts(cartId, updateData);
      if (!updatedCart) {
        return res.status(404).send({ status: "Error", message: "Carrito no encontrado" });
      }

      res.send({ status: "Success", payLoad: updatedCart });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "Error", message: "Error al actualizar el carrito" });
    }
  };

  deleteCarts = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const result = await this.cartsService.deleteCarts(cartId);
      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Error", message: "Error al eliminar el carrito" });
    }
  }

  createTicket = async (req, res) => {
    try {
      const { email } = req.body;
      console.log("Email del usuario:", email);

      const carts = await this.cartsService.getCartsByEmail(email);
      console.log("Carritos encontrados en MONGO:", carts);

      if (!carts || carts.length === 0) {
        return res.status(404).send({ status: "Error", message: "No hay carritos asociados a este email." });
      }

      const productService = new ProductDaoMongo();
      const allAvailableProducts = [];
      let totalAmount = 0;


      for (const cart of carts) {
        console.log("Procesando carrito:", cart);

        const product = await productService.getByCode(cart.code);
        console.log("Producto encontrado con getByCode:", product);

        if (product && product.stock >= cart.cant) {

          const productInfo = {
            code: cart.code,
            cant: cart.cant,
            price: product.price
          };
          allAvailableProducts.push(productInfo);
          totalAmount += product.price * cart.cant;

          console.log("Producto añadido:", productInfo);
          console.log("Total actual:", totalAmount);
        } else {
          console.log("Producto no disponible o stock insuficiente:", cart);
        }
       }


      if (allAvailableProducts.length === 0) {
        return res.status(400).send({ status: "Error", message: "No hay productos disponibles en stock." });
      }

      // Generar un número de ticket único
      const ticketCode = `TICKET-${Date.now()}`;

      // Crear el ticket
      const ticket = new Ticket({
        code: ticketCode,
        amount_number: totalAmount,
        userEmail: email,
        products: allAvailableProducts 
      });

      console.log("Ticket a ser guardado:", ticket);

      await ticket.save();

      // Enviar correo electrónico al cliente
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
          user: configObject.gmail_user,
          pass: configObject.gmail_pass
        }
      });

      const sendEmail = {
        from: configObject.gmail_user,
        to: email,
        subject: 'Detalles de tu compra',
        text: `Gracias por tu compra. Aquí están los detalles de tu ticket:\n\nCódigo de Ticket: ${ticketCode}\nTotal de la venta: $${totalAmount}\nProductos comprados: ${allAvailableProducts.map(p => `${p.code} (Cantidad: ${p.cant})`).join(', ')}`
      };

      await transporter.sendMail(sendEmail);

      res.send({ status: "Success", payLoad: ticket });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "Error", message: "Error al crear el ticket" });
    }
   };
 };

    

module.exports = {
  CartsController
}
