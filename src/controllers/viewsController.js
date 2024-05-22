import { ProductRepository } from '../repositories/productRepository.js';
import { MessageRepository } from '../repositories/messagesRepository.js';
import { CartRepository } from '../repositories/cartRepository.js';
import { addLogger } from "../middleware/index.js";

const productManager = new ProductRepository();
const messageManager = new MessageRepository();
const cartManager = new CartRepository();

const viewsController = {
  viewAllProducts: async (req, res) => {
    const { page = 1, limit = 9, sortBy = 'price', sortOrder = 'asc', category } = req.query;
    const sessionData = {
      email: req.session.user,
      role: req.session.role,
      cartId: req.session.cartId,
    };

    try {
      const result = await productManager.getProducts({
        category,
        page,
        limit,
        sortBy,
        sortOrder,
      });
      const { docs, hasPrevPage, hasNextPage, totalPages, prevPage, nextPage } = result;
      const products = docs;
      const response = {
        status: 'success',
        payload: products,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        limit: parseInt(limit),
        page: parseInt(page),
        selectedCategory: category,
        sortBy,
        sortOrder,
      };

      res.render("products", {
        title: "Product list",
        products,
        style: "../css/products.css",
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        limit: parseInt(limit),
        page: parseInt(page),
        selectedCategory: category,
        sortBy,
        sortOrder,
        user: sessionData.email,
        role: sessionData.role,
        cartId: sessionData.cartId,
      });
    } catch (error) {
      req.logger.error("API error",error.stack || error.message);
      res.status(500).json({
        status: 'error',
        payload: null,
        message: 'Internal Server Error',
      });
    }
  },

  addToCart: async (req, res) => {
    try {
      const productId = req.params.productId;
      const cartId = req.session.cartId;
      await cartManager.addProductToCart(cartId, productId);

      res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
      req.logger.warn(error.stack || error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  viewRealtimeProducts: async (req, res) => {
    const products = await productManager.getAll();
    
    const user = req.session.user;
    const role = req.session.role;

    res.render("realtime", {
      title: "Productos en tiempo real",
      products: products,
      style: "../css/products.css",
    });
  },

  viewCartProducts: async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartManager.getById(cartId);
    res.render("cart", {
      title: "Carrito",
      cart: cart,
      style: "../css/products.css",
    });
  },

  viewChat: (req, res) => {
    const user = req.session.user;

    res.cookie('userData', JSON.stringify({ user: user }), { httpOnly: true, maxAge: 20000 });
    const messages = messageManager.getAll();
    res.render("chat", {
      title: "Chat",
      user: user,
      messages: messages,
      style: "../css/chat.css"
    });
  }
};

export default viewsController;
