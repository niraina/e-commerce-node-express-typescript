import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const CategoryModel = mongoose.model('Categories', CategorySchema)