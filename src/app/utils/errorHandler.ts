import {ErrorRequestHandler} from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    return res.status(400).json({
        status: 400,
        message: err
    })
}