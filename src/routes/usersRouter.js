import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();


router.delete("/deleteOldUsers", userController.deleteOldUsers);
router.get("/", userController.getAllUsers);
router.get('/premium/:uid', userController.premiumRole);
router.delete("/:email", userController.deleteUser);

export default router;
