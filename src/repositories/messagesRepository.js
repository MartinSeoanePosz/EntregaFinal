import { messagesModel } from "../dao/models/messages.js";

export class MessageRepository {
    constructor() {
        this.messagesModel = messagesModel;
    }

    async getAll() {
        try {
            const messages = await this.messagesModel.find().lean();
            return messages;
        } catch (error) {
            console.log("Error fetching messages from the database:", error);
            throw error;
        }
    }
    async save(data) {
        try {
            const newMessage = new this.messagesModel(data);
            const message = await newMessage.save();
            return message;
        } catch (error) {
            console.log(error);
        }
    }
    async delete(id) {
        try {
            const message = await this.messagesModel.findByIdAndDelete(id);
            return message;
        } catch (error) {
            console.log(error);
        }
    }
}