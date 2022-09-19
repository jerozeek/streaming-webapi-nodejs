import { Request, Response } from 'express';
import {userFactory} from "../factories/userFactory";
import {response} from "../helpers/resource";
import {UserResource} from "../resource/UserResource";
import {Cookies} from "../helpers/cookies";
import {Auth} from "../midldlewares/auth";

const serviceInstance = userFactory();

const login = async (req: Request, res: Response) => {

    const { deviceId, password } = req.body;

   serviceInstance.login(password, deviceId).then(async (user) => {

       if (user.status === 'pending') {
           return response(res).success(200, 'An OTP have been sent to your email.', {email: user.email})
       }

       const accessToken    = await serviceInstance.createAccessToken(user);
       const refreshToken   = await serviceInstance.createRefreshToken(user);

       if (user.deviceId === 'web') Cookies.set(res, refreshToken);

       return response(res).success(200, 'Login was successful', {
           user: new UserResource(user).all(),
           accessToken,
           refreshToken: user.deviceId === 'web' ? null : refreshToken
       })
   }).
   catch((e: Error) => {
      return response(res).error(e.message);
   })
}

const signup = async (req: Request, res: Response) => {

    const user          = await serviceInstance.signup();
    const accessToken   = await serviceInstance.createAccessToken(user);
    const refreshToken  = await serviceInstance.createRefreshToken(user);

    if (user.deviceId === 'web') Cookies.set(res, refreshToken);

    return response(res).success(200, 'Account created successfully', {
        user: new UserResource(user).all(),
        accessToken,
        refreshToken: user.deviceId === 'web' ? null : refreshToken
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
    serviceInstance.verifyOtp().then((result) => {
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