import {UserProp} from "../repositories/interfaces";
import {Response} from "express";

export interface serviceInterface {
    login: (password: string, deviceId: string) => Promise<UserProp>
    passwordResetRequest: () => Promise<UserProp>
    signup: () => Promise<UserProp>
    createAccessToken: (user:UserProp) => Promise<string | null>
    createRefreshToken: (user:UserProp) => Promise<string | null>
    verifyOtp: () => Promise<UserProp | boolean>
    resetPassword: (password: string) => Promise<void>
    logout: (refreshToken: string, isWeb: boolean, res: Response) => Promise<void>
    revalidateUser: (refreshToken: string) => Promise<reAuthType>
    uploadImage :(file: FileProps) => Promise<string>
}

export interface reAuthType {
    accessToken: string | null,
    user: UserProp
}

export interface FileProps {
    name: string;
    mimetype: string;
    size: number;
    tempFilePath: string,
}