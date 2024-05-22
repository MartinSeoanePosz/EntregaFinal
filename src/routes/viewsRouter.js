import express from 'express';
import viewsController from '../controllers/viewsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get("/products", auth, viewsController.viewAllProducts);
router.post("/api/add-to-cart/:productId", auth, viewsController.addToCart);
router.get("/realtime", auth, viewsController.viewRealtimeProducts);
router.get("/cart/:cid", auth, viewsController.viewCartProducts);
router.get("/chat", auth, viewsController.viewChat);

export default router;
