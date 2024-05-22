import multer from 'multer';
import { __dirname } from '../fileUtils.js';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create a directory based on user ID or some other identifier
        const uploadDir = path.join(__dirname, `../public/uploads/`);

        // Check if the directory exists, create it if it doesn't
        fs.mkdirSync(uploadDir, { recursive: true });

        // Set the destination to the created directory
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const uploader = multer({ storage: storage });