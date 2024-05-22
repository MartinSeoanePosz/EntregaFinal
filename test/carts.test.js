import mongoose from 'mongoose';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { CartRepository } from '../src/repositories/cartRepository.js';
import { db } from '../src/config/index.js';

dotenv.config();

mongoose.connect(
    `mongodb+srv://${db.user}:${db.pass}@${db.host}/${db.name}`
);

describe ('Carts testing', () => {
    const carts = new CartRepository();
    let cartId;
    before(async function () {
        await new Promise(resolve => {
            mongoose.connection.once('open', resolve);
        });
    });

    beforeEach(function(){
        this.timeout(5000);
    });

    it('should return all carts', async () => {
        try {
            const cartsList = await carts.getAll();
            expect(cartsList).to.be.an('array');
            expect(cartsList.length).to.be.greaterThan(0);
            // console.log(`Found ${cartsList.length} carts`);
        } catch (error) {
            console.error('Error in test case:', error);
            throw error;
        }
    });
    it('should create a cart respecting the model', async () => {
        try {
            const cart = await carts.add({
                timestamp: new Date(),
                products: [
                    { productId: mongoose.Types.ObjectId(), quantity: 2 },
                    { productId: mongoose.Types.ObjectId(), quantity: 3 }
                ]
            });

            cartId = cart._id.toString();

            expect(cart).to.have.property('timestamp');
            expect(cart).to.have.property('products');
            expect(cart.products).to.be.an('array');
            expect(cart.products.length).to.equal(2); 

        } catch (error) {
            console.error('Error in create cart test case:', error);
            throw error;
        }
    });

    it('should delete the created cart', async () => {
        try {
            expect(cartId).to.be.a('string');

            const deletedCart = await carts.delete(cartId);
            
            expect(deletedCart).to.be.an('object');
            expect(deletedCart._id.toString()).to.equal(cartId);

        } catch (error) {
            console.error('Error in delete cart test case:', error);
            throw error;
        }
    });

});