import mongoose from "mongoose";

const AttachementSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        product: [{ type: mongoose.Types.ObjectId, ref: "Products" }],
    },
    {
        timestamps: true
    }
);

export const AttachementModel = mongoose.model('Attachement', AttachementSchema)