import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    path: String,
    originalName: String,
    mimeType: String,
    size: Number
});

const Document = mongoose.model('Document', documentSchema);

export default Document;