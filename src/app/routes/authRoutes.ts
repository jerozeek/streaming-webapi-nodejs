import { Request, Response } from 'express';
import {userFactory} from "../factories/userFactory";
import {response} from "../helpers/resource";
import {Auth} from "../midldlewares/auth";
import {ResponseFactory} from "../core/responseCore/responseFactory";
import {KeyPatternErrorMessage} from "../helpers";

const serviceInstance = userFactory();

const login = async (req: Request, res: Response) => {

    const { deviceId, password } = req.body;

   serviceInstance.login(password, deviceId).then(async (user) => {
       return new ResponseFactory(res, user).send();
   }).
   catch((e: Error) => {
      return response(res).error(e.message);
   })
}

const signup = async (req: Request, res: Response) => {

    serviceInstance.signup().then((user) => {
        return new ResponseFactory(res, user).send();
    }).
    catch((e:any) => {
        return response(res).error(KeyPatternErrorMessage(e))
    })
}

const forgetPassword = async (req: Request, res: Response) => {
   serviceInstance.passwordResetRequest().then((user) => {
      return response(res).success(200, 'An OTP have been sent to your email', {email: user.email})
   }).
   catch((e:Error) => {
      return response(res).error(e.message);
   });
}

const verifyOtp = async (req: Request, res: Response) => {
    serviceInstance.verifyOtp().then(() => {
        return response(res).success(200, 'Verification was successful', {email: Auth.user().email})
    }).
    catch(() => {
        return response(res).error('Invalid OTP')
    })
}

const resetPassword = async (req: Request, res: Response) => {
    serviceInstance.resetPassword(req.body.password).then(() => {
        return response(res).success(200, 'Password updated successfully')
    }).
    catch((e:Error) => {
        return response(res).error(e.message);
    });
}

const logout = async (req: Request, res: Response) => {
    return res.status(200).json({
        status: true
    })
}

export = { login, forgetPassword, signup, logout, verifyOtp, resetPassword }