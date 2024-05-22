import express from 'express';
import cartController from '../controllers/cartController.js';

const router = express.Router();

router.get('/', cartController.getAllCarts);
router.post('/', cartController.createCart);
router.get('/:id', cartController.getCartById);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCartProducts);
router.post('/:id/product/:pid', cartController.addProductToCart);
router.delete('/:id/product/:pid', cartController.removeProductFromCart);


export default router;
