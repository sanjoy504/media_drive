import { Schema, model } from 'mongoose';

const uploadItemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    folder: {
        type: Schema.Types.ObjectId,
        ref: 'UploadItem',
    },
    fileSize: {
        type: String,
        required: false,
    },
    uploadLink: {
        type: String,
        required: false,
    },
   creatAt: {
    type: Date,
    default: Date.now,
   }
});

const UploadItem = model('UploadItem', uploadItemSchema);

export default UploadItem;
