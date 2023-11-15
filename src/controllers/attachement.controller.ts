import { NextFunction, Response } from "express";
import { AttachementModel } from "../models/attachement.model";
import { ProductModel } from "../models/product.model";

export const setAttachement = async (req: any, res: Response<any>, next: NextFunction) => {
    try {
      const productId = req.body.product;
        const newFile = new AttachementModel({
          filename: req.file.originalname,
          path: req.file.path.replace(/\\/g, '/'),
          product: productId
        });
        const savedFile = await newFile.save();
        await ProductModel.updateMany({ '_id': newFile.product }, { $push: { attachement: newFile._id } });
        res.json(savedFile);
      } catch (err) {
        next(err);
      }
};