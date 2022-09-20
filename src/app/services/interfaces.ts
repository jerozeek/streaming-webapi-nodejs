import {UserProp} from "../repositories/interfaces";
import {Response} from "express";

export interface serviceInterface {
    login: (password: string, deviceId: string) => Promise<UserProp>
    passwordResetRequest: () => Promise<UserProp>
    signup: () => Promise<UserProp>
    createAccessToken: (user:UserProp) => Promise<string | null>
    createRefreshToken: (user:UserProp) => Promise<string | null>
    verifyOtp: () => Promise<boolean>
    resetPassword: (password: string) => Promise<void>
    logout: (refreshToken: string, isWeb: boolean, res: Response) => Promise<void>
    revalidateUser: (refreshToken: string) => Promise<reAuthType>
}

export interface reAuthType {
    accessToken: string | null,
    user: UserProp
}