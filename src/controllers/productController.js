import { ProductRepository } from '../repositories/productRepository.js';
import { addLogger } from "../middleware/index.js";
import { MAILER } from '../config/indexconfig.js';
import MailingService from '../services/mailing.js';

const products = new ProductRepository();
const mailingService = new MailingService();

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const allProducts = await products.getAll();
      res.json(allProducts);
    } catch (error) {
      req.logger.info(error.stack || error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createProduct: async (req, res) => {
    const { title, description, price, thumbnail, code, category, stock } = req.body;
    const userEmail = req.session.user;
    const userRole = req.session.role;
  
    try {
      const owner = userRole !== 'admin' ? userEmail : 'admin';

      
      const response = await products.save({ 
        title, 
        description, 
        price, 
        thumbnail, 
        code, 
        category, 
        stock, 
        owner: owner
      });

      res.json(response);
      console.log("product added successfully")
    } catch (error) {
      req.logger.warn(error.stack || error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  

  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await products.getById(id);
      res.json(product);
    } catch (error) {
      req.logger.info(error.stack || error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { title, description, price, thumbnail, code, category, stock } = req.body;
    try {
      const response = await products.update(id, { title, description, price, thumbnail, code, category, stock });
      res.json(response);
    } catch (error) {
      req.logger.info(error.stack || error.message);
    }
  },

  deleteProduct: async (req, res) => { 
    const { id } = req.params;
    const userEmail = req.session.user; 
    const userRole = req.session.role; 

    try {
      const product = await products.getById(id);

      if (userRole === 'admin') {
      } else {
        if (product.owner === userEmail) {
        } else {
          throw new Error('Insufficient permissions to delete this product');
        }
      }

      const deletedProduct = await products.delete(id);

      if (userRole !== 'admin') {
        const mailOptions = {
          from: MAILER.user,
          to: product.owner,
          subject: 'Your Product has been Deleted',
          html: '<p>Your product has been deleted.</p>'
        };
        await mailingService.outboundEmail(mailOptions);
      }

      res.json(deletedProduct);
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default productController;
