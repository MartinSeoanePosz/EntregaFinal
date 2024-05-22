import User from '../dao/models/users.js';


export class UserRepository{
    constructor(){
        this.userModel = User;  
    }


    async upgradeToPremium(userId) {
        try {
            const user = await this.userModel.findById(userId);

            if (!user) {
            throw new Error('User not found');
            }
            user.role = 'premium';
            await user.save();

            return user;
        } catch (error) {
        throw error; 
        }
    }
    async deleteUserByEmail(email) {
        try {
            const user = await this.userModel.findOneAndDelete({ email });
            return user;
        } catch (error) {
            throw error;
        }
    }
    async getAllandDisplay() {
        try {
            const users = await this.userModel.find().lean();
            return users;
        } catch (error) {
            throw error;
        }
    }   
    async getAll() {
        try {
            const users = await this.userModel.find().lean();
            return users;
        } catch (error) {
            throw error;
        }
    } 
    async createUser(data) {
        try {
            const newUser = new this.userModel(data);
            const user = await newUser.save();
            return user;
        } catch (error) {
            throw error;
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await this.userModel.findOne({ email });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async setLastConnection(user) {
        try {
            return await user.updateOne({ lastConnection: new Date() });
        } catch (error) {
            throw error;
        }
    }
    async  saveDocuments(userId, documentId) {
        try {
            return await User.findByIdAndUpdate(userId, { $push: { documents: documentId } }, { new: true });
        } catch (error) {
            throw new Error(`Error updating user documents: ${error.message}`);
        }
    }
}

