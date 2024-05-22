import express from 'express';
import Document from '../dao/models/documents.js';
import { UserRepository } from '../repositories/userRepository.js';
import User from '../dao/models/users.js';

const router = express.Router();
const userRepository = new UserRepository();

router.get('/users/:uid/documents', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "User not logged in" });
        }

        const userEmail = req.session.user;

        const user = await userRepository.getUserByEmail(userEmail);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = user._id;

        const documentIds = user.documents;

        const documents = await Document.find({ _id: { $in: documentIds } }).lean();
        res.render('documents', {
            title: 'Documents',
            style: '../../css/documents.css',
            documents: documents 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;