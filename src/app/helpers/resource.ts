import { Response } from 'express';

export const response = (res: Response) => {

    const success = (statusCode: number = 200, message: string = "Action was successful", data: any = {}) => {
        return res.status(statusCode).json({
            status: statusCode,
            message,
            data
        });
    }

    const error = (message: string = "Something went wrong", statusCode: number = 400) => {
        return res.status(statusCode).json({
            status: statusCode,
            message,
        });
    }

    return { success, error }
}