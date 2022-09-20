import { Request, Response } from 'express';
import {userFactory} from "../factories/userFactory";
import {response} from "../helpers/resource";
import {Auth} from "../midldlewares/auth";
import {ResponseFactory} from "../core/responseCore/responseFactory";
import {KeyPatternErrorMessage} from "../helpers";
import {ALLOWED_CHANNELS} from "../utils/util";
import {UserResource} from "../resource/UserResource";
import {reAuthType} from "../services/interfaces";

const serviceInstance = userFactory();

const login = async (req: Request, res: Response) => {

    const { deviceId, password } = req.body;

   serviceInstance.login(password, deviceId).then(async (user) => {
       return new ResponseFactory(res, user).send('login');
   }).
   catch((e: Error) => {
      return response(res).error(e.message);
   })
}

const signup = async (req: Request, res: Response) => {

    serviceInstance.signup().then((user) => {
        return new ResponseFactory(res, user).send('signup');
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

    if (req.body.refreshToken !== undefined)
    {
        serviceInstance.logout(req.body.refreshToken, false, res).then(() => {
            return response(res).success(204);
        }).
        catch((e: Error) => {
            return response(res).error(e?.message)
        })
    }
    else
    {
        const cookies = req.cookies;

        if (!cookies?.token) throw new Error('No token found')

        serviceInstance.logout(cookies?.token, true, res).then(() => {
            return response(res).success(204);
        }).
        catch((e: Error) => {
            return response(res).error(e?.message)
        })
    }
}

const revalidateToken = async (req: Request, res: Response) => {

    const { channel } = req.params;

    if (!ALLOWED_CHANNELS.includes(channel)) throw new Error('Invalid validate channel')

    let results: reAuthType;

    if (channel === 'mobile')
    {
        const { refreshToken } = req.body;
        if (refreshToken === undefined) throw new Error('No refresh token found')
        results = await serviceInstance.revalidateUser(refreshToken);
    }
    else
    {
        const cookies = req.cookies;
        if (!cookies?.token) throw new Error('No refresh token found')
        results = await serviceInstance.revalidateUser(cookies?.token);
    }

    return response(res).success(200, 'Token generated successfully', {
        accessToken: results.accessToken,
        user: new UserResource(results.user).all()
    })
}

export = { login, forgetPassword, signup, logout, verifyOtp, resetPassword, revalidateToken }