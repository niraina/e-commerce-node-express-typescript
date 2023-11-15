import { Request, Response } from "express";
import { ProductModel } from "../models/product.model";
import { CategoryModel } from "../models/category.model";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const page = +req.query.page || 1;
        const itemsPerPage = +req.query.itemsPerPage || 10;

        const searchTerm = req.query.search;
        const categoryFilter = req.query.category;
        const priceFilter = req.query.price;

        const searchConditions: any = {};
        
        if (categoryFilter) {
            searchConditions.category = categoryFilter;
        }
        
        if (priceFilter) {
            searchConditions.price = priceFilter;
        }
        
        if (searchTerm) {
            searchConditions.$or = [
                { title: { $regex: searchTerm, $options: "i" } },
                { about: { $regex: searchTerm, $options: "i" } },
            ];
        }
        const totalItems = await ProductModel.countDocuments(searchConditions);
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const products = await ProductModel.find(searchConditions)
            .populate({ path: 'category' })
            .populate({ path: 'attachement', select: ['filename', 'path'] })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        res.status(200).json({
            status: {
                code: 200,
                success: true,
                message: "success",
                errorCode: "",
            },
            data: products,
            pagination: {
                page,
                currentPage: page,
                itemsPerPage,
                totalItems,
                totalPages,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: {
                code: 500,
                success: false,
                message: "Internal Server Error",
                errorCode: "INTERNAL_SERVER_ERROR",
            },
            data: null,
            payload: {},
        });
    }

}


export const getProductById = async (req: Request, res: Response) => {
    const productId = req.params.id
    try {
        const product = await ProductModel.findById(productId)
            .populate({ path: 'category' })
            .populate({ path: 'attachement', select: ['filename', 'path'] })
        return res.status(200).json({
            status: {
                code: 200,
                success: true,
                message: "",
                errorCode: "",
            },
            data: product,
            payload: {}
        });
    } catch (error) {
        return res.status(400).json({
            status: {
                code: 400,
                success: false,
                message: error,
                errorCode: "",
            },
            data: error,
            payload: {}
        });
    }
};

export const setProduct = async (req: Request, res: Response) => {
    let error = null;

    switch (true) {
        case !req.body.title:
            error = "Merci d'ajouter un titre";
            break;
        case !req.body.price:
            error = "Merci d'ajouter le prix";
            break;
        case !req.body.quantity:
            error = "Merci d'ajouter la quantité";
            break;
    }

    if (error) {
        res.status(400).json({
            status: {
                code: 400,
                success: false,
                message: error,
                errorCode: "",
            },
            data: null,
            payload: {}
        })
    } else {
        const product = await ProductModel.create({
            title: req.body.title,
            price: req.body.price,
            quantity: req.body.quantity,
            about: req.body.about,
            category: req.body.category
        });
        CategoryModel.updateMany({ '_id': product.category }, { $push: { products: product._id } })
        res.status(201).json({
            status: {
                code: 201,
                success: true,
                message: "Produit ajouter avec succes",
                errorCode: "",
            },
            product,
            payload: {}
        })
    }
};

