//import v2, {UploadApiErrorResponse, UploadApiResponse} from 'cloudinary';
import {v2 as cloudinary} from 'cloudinary'
import { FileProps } from './interface';

export const fileUploader = async (file: FileProps, path: string, cb: Function) => {
    let err = null;
    let response = null;
    const extention = file.mimetype;
    const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!file)
    {
        err = 'No file selected';
    }

    else if(file.size > 5000000)
    {
        err = 'File too large';
    }

    //check if file is an image
    else if (allowedExtensions.indexOf(extention) === -1)
    {
        err = 'File is not an image';
    }
    else
    {
        await cloudinary.uploader.upload(file.tempFilePath, {folder: path}, (error: any, result: any) => {
            if (error) {
                err = error.message;
            } else {
                response = result.secure_url;
            }
        });
    }

    return cb(err, response);
}