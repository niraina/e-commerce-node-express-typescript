import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        about: {
            type: String,
            required: false
        },
        category: [{type: mongoose.Types.ObjectId, ref: "Categories"}],
        attachement: [{ type: mongoose.Types.ObjectId, ref: "Attachement" }],
    },
    {
        timestamps: true
    }
);

export const ProductModel = mongoose.model('Products', ProductSchema)