import express from 'express';
import {listOfProducts} from '../helpers/mockProducts.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try{
    const {products} = listOfProducts();
    res.json(products);
    }catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
    }
});

export default router;