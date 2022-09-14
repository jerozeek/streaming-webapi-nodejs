import {UserProp} from "../repositories/interfaces";

export interface serviceInterface {
    login: (password: string, deviceId: string) => Promise<UserProp>
    passwordResetRequest: () => Promise<UserProp>
    signup: () => Promise<UserProp>
    createAccessToken: (user:UserProp) => Promise<string | null>
    createRefreshToken: (user:UserProp) => Promise<string | null>
}