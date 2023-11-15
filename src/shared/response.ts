import { Response } from "express";

export const sendSuccessResponse = (res: Response, statuCode: number, success: string, data: any, pagination?: any) => {
    res.status(statuCode).json({
        status: {
            code: statuCode,
            success: true,
            message: success,
            errorCode: "",
        },
        data: data,
        pagination: pagination || null
    });
}

export const sendErrorResponse = (res: Response, statuCode: number, error: string) => {
    res.status(statuCode).json({
        status: {
            code: statuCode,
            success: false,
            message: error,
            errorCode: "",
        },
        data: null,
    });
}