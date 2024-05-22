import {faker} from '@faker-js/faker';


export const listOfProducts = () => {
    const numOfProducts = 100;
    const products = [];
    for(let i = 0; i < numOfProducts; i++){
        products.push(generateProducts());
    }
    const user = generateUser();
    return {
        // user: user,
        products: products
    };
}

const generateUser = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        id: faker.database.mongodbObjectId(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        age: Math.floor(Math.random() * 100),
        role: "admin"
    };
}

const generateProducts = () => {
    return{
        // id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.commerce.isbn(),
        category: faker.commerce.department(),
        stock: Math.floor(Math.random() * 100),
    }
}
// console.log(listOfProducts());