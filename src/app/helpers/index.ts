import moment from "moment";
import {throw_exception} from "../utils/exceptions";
import Stripe from "stripe";
import {ZodError} from "zod";
import { Response } from 'express';

export const KeyPatternErrorResponse = (e: any, res: Response) => {
    const errorMessage = KeyPatternErrorMessage(e);
    return throw_exception(errorMessage, res);
}

export const KeyPatternErrorMessage =(e: any) => {
    let errorMessage = '';
    let data: any = {};
    let errorReceived = e.keyPattern;
    if (typeof errorReceived === 'object')
    {
        for (let key in errorReceived)
        {
            errorMessage = `${key} already exists.`;
        }
    }
    else
    {
        if (e instanceof ZodError){
            errorMessage = 'Validation Error';
            data = JSON.parse(e?.message)
        }

        //stripe payment
        else if (e instanceof Stripe.errors.StripeError){
            errorMessage = e?.message;
        }

        else errorMessage = e?.message
    }

    return errorMessage;
}

export const generateRandomChar = (length: number = 4) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const generateRandomNumber = (length: number = 4): string => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if (result.length < length) {
        generateRandomNumber(length);
    }
    return result;
}

export const expiryTimeInMinutes = (time: number = 30) => {
    return moment().add(time, 'minutes').unix()
}

export const hasExpiry = (actualTime: number) => {
    const currentTime = moment().unix();
    if (currentTime > actualTime) return true;
}

export const now = moment().unix();