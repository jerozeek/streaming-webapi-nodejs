import { Response } from 'express';
import {UserProp} from "../../repositories/interfaces";
import {Otp} from "../../helpers/otp";
import {response} from "../../helpers/resource";
import {userFactory} from "../../factories/userFactory";
import {UserResource} from "../../resource/UserResource";
import {Cookies} from "../../helpers/cookies";

const serviceInstance = userFactory();

export class ResponseFactory {

    private readonly res: Response;
    private readonly user: UserProp

    constructor(res: Response, user: UserProp) {
        this.res = res;
        this.user = user;
    }

    public send(type: string)
    {
        switch (this.user.status)
        {
            case 'pending' :
                return this.pending()

            case 'active' :
                return this.active(type)

            case 'disabled' :
                return this.disabled()
        }
    }


    private async pending() {
        await Otp.set(1, this.user.email);
        return response(this.res).success(200, 'An OTP have been sent to your email.', {email: this.user.email})
    }

    private async disabled() {
        return response(this.res).error('Account have been disabled. Please contact support');
    }

    private async active(type: string)
    {
        const accessToken  = await serviceInstance.createAccessToken(this.user);
        const refreshToken = await serviceInstance.createRefreshToken(this.user);

        if (this.user.deviceId === 'web') Cookies.set(this.res, refreshToken);

        return response(this.res).success(200, type === 'login' ? 'Login was successful' : 'Account created successfully', {
            user: new UserResource(this.user).all(),
            accessToken,
            refreshToken: this.user.deviceId === 'web' ? null : refreshToken
        })
    }

}