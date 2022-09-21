import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {Auth} from "./auth";

export const verifyToken = async (req:Request, res: Response, next: NextFunction) => {

    try{
        let token = req.header('Authorization');

        if (token)
        {
            const accessToken: string = token.split(' ')[1];
            try{
                const secret = process.env.ACCESS_TOKEN_SECRET || '';

                req.user = <unknown>jwt.verify(accessToken, secret);

                return Auth.userAuth(req.user.email, req, res, next);
            }
            catch (e) {
                console.log(e);
                return res.status(403).json({
                    status: 403,
                    message: 'Invalid Authorization token',
                })
            }
        }
        else
        {
            return res.status(403).json({
                status: 403,
                message: 'No Authorization token found',
            })
        }
    }
    catch (e:any) {
        return res.status(403).json({
            status: 403,
            message: e.message
        })
    }
}