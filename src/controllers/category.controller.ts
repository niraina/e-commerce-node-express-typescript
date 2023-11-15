import { Request, Response } from "express";
import { CategoryModel } from "../models/category.model";
import { sendErrorResponse, sendSuccessResponse } from "../shared/response";

export const getCategories = async (req: Request, res: Response) => {
    try {
        const page = +req.query.page || 1;
        const itemsPerPage = +req.query.itemsPerPage || 10;
        const searchConditions: any = {};
        const label = req.query.label
        if (label) {
            searchConditions.label = { $regex: label, $options: "i" };;
        }
        const totalItems = await CategoryModel.countDocuments(searchConditions);
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const response = await CategoryModel.find(searchConditions)

        sendSuccessResponse(res, 200, "success", response, {
            page,
            currentPage: page,
            itemsPerPage,
            totalItems,
            totalPages,
        })
    } catch (error) {
        sendErrorResponse(res, 500, error)
    }
}

export const getCategory = async (req: Request, res: Response) => {
    const id = await CategoryModel.findById(req.params.id)
    if(!id) {
        sendErrorResponse(res, 400, "Cette categorie n'existe pas")
    }
    const findMarque = await CategoryModel.findById(id)
    sendSuccessResponse(res, 200, "success", findMarque)
}

export const setCategory = async (req: Request, res: Response) => {
    let error = null;

    switch (true) {
        case !req.body.label:
            error = "Merci de remplire le label";
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
        const category = await CategoryModel.create({
            label: req.body.label
        });
        res.status(201).json({
            status: {
                code: 201,
                success: true,
                message: "Categorie ajouter avec succes",
                errorCode: "",
            },
            category,
            payload: {}
        })
    }
};
