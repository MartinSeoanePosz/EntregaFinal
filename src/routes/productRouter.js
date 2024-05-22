import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.post('/newproduct', productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
