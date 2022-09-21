import { Request, Response } from 'express';
import validations from '../entities/Rules/validations';
import {Auth} from "../midldlewares/auth";
import {userFactory} from "../factories/userFactory";
import {response} from "../helpers/resource";
import {KeyPatternErrorMessage} from "../helpers";
import { FileProps } from '../helpers/interface';

const serviceInstance = userFactory();

const updatePassword = (req: Request, res: Response) => {

    const { password, confirmPassword } = req.body;

    const data = validations.passwordResetSchema.parse({email: Auth.user().email, password, confirmPassword});

    if (password !== confirmPassword) throw new Error('Password do not match confirm password')

    serviceInstance.resetPassword(data.password).then(() => {
        return response(res).success(200, 'Password updated successfully');
    }).
    catch((e: any) => {
        return response(res).error(KeyPatternErrorMessage(e))
    })
}

const uploadProfileImage = async (req: Request, res: Response) => {

    let file: FileProps | any;

    file = req.files === undefined || req.files === null ? null : req.files.file;

    if (file === null) throw new Error('No file selected')

    serviceInstance.uploadImage(file).then((uri) => {
        return response(res).success(200, 'File uploaded successfully', {path:uri})
    }).
    catch((e: Error) => {
        return response(res).error(e?.message)
    })
}

export = { updatePassword, uploadProfileImage }