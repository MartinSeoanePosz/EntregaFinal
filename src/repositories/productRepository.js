import { productModel } from "../dao/models/products.js";

export class ProductRepository {
    constructor() {
        this.productModel = productModel;
    }

    async getAll() {
        try {
            const products = await this.productModel.find().lean();
            return products;
        } catch (error) {
            console.log(error);
        }
    }
    async getById(id) {
        try {
            if (id) {
                const product = await this.productModel.findById(id).lean();
                return product;
            } else {
                const products = await this.productModel.find().lean();
                return products;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async save(data) {
        try {
            const newProduct = new this.productModel(data);
            const product = await newProduct.save();
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async update(id, data) {
        try {
            const product = await this.productModel.findByIdAndUpdate(id, data);
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async delete(id) {
        try {
            const product = await this.productModel.findByIdAndDelete(id);
            return product;
        } catch (error) {
            console.log(error);
        }
    }
    async paginate(query, options) {
        try {
            const products = await this.productModel.paginate(query, options);
            return products;
        } catch (error) {
            console.log(error);
            throw error; 
        }
    }

    async getProducts({ category, page = 1, limit = 9, sortBy = 'price', sortOrder = 'asc' }) {
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const query = {};
        if (category) {
            query.category = category;
        }

        const options = {
            limit: parseInt(limit),
            page,
            sort: sortOptions,
            lean: true,
        };

        try {
            const result = await this.productModel.paginate(query, options);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
      