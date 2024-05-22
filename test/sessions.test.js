import mongoose from 'mongoose';
import { expect } from 'chai';
import dotenv from 'dotenv';
import supertest from 'supertest';
import { db } from '../src/config/index.js';

dotenv.config();

const requester = supertest('http://localhost:8080');

mongoose.connect(
    `mongodb+srv://${db.user}:${db.pass}@${db.host}/${db.name}`
).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

describe('Session testing', () => {
    let cookie;

    before(async function () {
        await new Promise(resolve => {
            mongoose.connection.once('open', resolve);
        });
    });

    it('should register a user successfully', async function () {
        try {
            const mockUser = {
                first_name: 'Martin',
                last_name: 'Seoane',
                age: 25,
                email: 'sessiontest1@gmail.com',
                password: '12345678',
            };

            const response = await requester.post('/signup').send(mockUser);
            console.log('Response body:', response.body);

            expect(response.body.respuesta).to.be.ok;
        } catch (err) {
            console.error('Error in user registration:', err);
            throw err;
        }
    });
    it('Should log in the user and return a cookie.', async function () {
        const mockUser = {
            email: 'sessiontest1@gmail.com',
            password: '12345678',
        };

        const result = await requester.post('/login').send(mockUser);
        const cookieResult = result.headers['set-cookie'][0];

        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1],
        };
        expect(cookie.name).to.be.ok.and.eql('userData');
        expect(cookie.value).to.be.ok.and.not.eql('');
    });
    it('should delete a user by email', async function () {
        try {
            const userEmail = 'sessiontest1@gmail.com';
            const response = await requester.delete(`/api/users/${userEmail}`);

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('User deleted successfully');
        } catch (err) {
            console.error('Error deleting user:', err);
            throw err;
        }
    });


});