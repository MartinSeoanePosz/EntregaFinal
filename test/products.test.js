import mongoose from 'mongoose';
import Assert from 'assert';
import dotenv from 'dotenv';
import { ProductRepository } from '../src/repositories/productRepository.js';
import { db } from '../src/config/index.js';

dotenv.config();

const assert = Assert.strict;

mongoose.connect(
    `mongodb+srv://${db.user}:${db.pass}@${db.host}/${db.name}`
);
describe('Products testing', () => {
    const products = new ProductRepository();
    let sampleProduct;

    before(async function () {
        await new Promise(resolve => {
            mongoose.connection.once('open', resolve);
        });
    });

    beforeEach(function(){
        this.timeout(5000);
    });

    it('should return all products', async () => {
        try {
            const productsList = await products.getAll();

            if (!productsList || !Array.isArray(productsList)) {
                throw new Error('Failed to fetch products: Invalid response');
            }
            console.log(`Found ${productsList.length} products`);

            assert.ok(productsList.length > 0, 'Products array is empty');

        } catch (error) {
            console.error('Error in test case:', error);
            throw error; 
        }
    });

    it('should create a product', async () => {
        try {
            const productData = {
                title: 'Sample Product',
                description: 'Sample description',
                price: 10,
                thumbnail: 'sample-thumbnail.jpg',
                code: 'SP00q12es1',
                category: 'Sample Category',
                stock: 100,
                owner: 'admin'
            };
            sampleProduct = await products.save(productData);

            assert.strictEqual(sampleProduct.title, productData.title);
            assert.strictEqual(sampleProduct.description, productData.description);
            assert.strictEqual(sampleProduct.price, productData.price);
            assert.strictEqual(sampleProduct.thumbnail, productData.thumbnail);
            assert.strictEqual(sampleProduct.code, productData.code);
            assert.strictEqual(sampleProduct.category, productData.category);
            assert.strictEqual(sampleProduct.stock, productData.stock);
            assert.strictEqual(sampleProduct.owner, productData.owner);
            // console.log('Created product:', sampleProduct);
        } catch (error) {
            console.error('Error creating product:', error);
            throw error; 
        }
    });

    it('should delete the created product', async () => {
        try {
            if (!sampleProduct || !sampleProduct._id) {
                throw new Error('Sample product not found or missing _id');
            }

            await products.delete(sampleProduct._id);

            const deletedProduct = await products.getById(sampleProduct._id);

            assert.strictEqual(deletedProduct, null, 'Deleted product still exists');
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    });

});
