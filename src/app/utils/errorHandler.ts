import {ErrorRequestHandler} from "express";
import {KeyPatternErrorResponse} from "../helpers";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
   return KeyPatternErrorResponse(err, res)
}