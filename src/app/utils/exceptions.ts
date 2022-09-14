import { Response } from 'express';

export const throw_exception = (message: string, res: Response) => {
    return res.status(500).json({
        status: 500,
        message
    })
}