import {FileProps, reAuthType, serviceInterface} from './interfaces';
import {UserProp, userRepositoryInterface} from "../repositories/interfaces";
import {Auth} from "../midldlewares/auth";
import { KeyPatternErrorMessage } from "../helpers";
import {Password} from "../helpers/password";
import {Otp} from "../helpers/otp";
import jwt from "jsonwebtoken";
import {Cookies} from "../helpers/cookies";
import { Response } from 'express';
import {fileUploader} from "../helpers/fileUploader";

export class UserServices implements serviceInterface {

    private userRepository: userRepositoryInterface;

    constructor(userRepository: userRepositoryInterface) {
        this.userRepository = userRepository
    }

    public login(password: string, deviceId: string): Promise<UserProp> {

        return new Promise(async (resolve, reject) => {

            const user = Auth.user();

            if (Password.verify(user.password, password))
            {
                const newUserObject = await this.userRepository.createLogin(user.email, deviceId);

                return resolve(newUserObject)
            }

            return reject({message: 'Invalid login credentials'})
        })
    }

    public signup(): Promise<UserProp> {

        return new Promise(async (resolve, reject) => {
            const payload       = Auth.signupData();
            await this.userRepository.create(payload).then(async (result) => {
                return resolve(result);
            }).
            catch((e: Error) => {
                return reject({message: KeyPatternErrorMessage(e)})
            })
        })
    }

    public passwordResetRequest(): Promise<UserProp> {

        return new Promise(async (resolve, reject) => {

            const user = Auth.user();

            await Otp.set(2, user.email, true)

            return resolve(user);
        })
    }

    public async createAccessToken(user:UserProp):Promise<string | null> {
        return await this.userRepository.generateAccessToken(user)
    }

    public async createRefreshToken(user:UserProp):Promise<string | null> {
        return await this.userRepository.generateRefreshToken(user);
    }

    public async verifyOtp(): Promise<UserProp | boolean> {

        return new Promise(async (resolve, reject) => {
            if (Otp.compare())
            {
                await this.resetOtp(Auth.user().email, Auth.verifyType === 'passwordReset');

                //set status of account to active after confirmation
                if (Auth.verifyType !== 'passwordReset'){
                    const userProp = await this.userRepository.updateUserFields(Auth.user().email, {status: 'active'})
                    return resolve(userProp);
                }

                return resolve(true)
            }
            return reject(false);
        })
    }

    public resetPassword(password: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const user = Auth.user();
            await this.userRepository.updateUserFields(user.email, {password: Password.hash(password)})
            return resolve();
        })
    }

    private async resetOtp(email: string, passwordReset: boolean = true): Promise<boolean> {
        //update the otp...
        await Otp.set(3, email, passwordReset)
        return true
    }

    public logout(refreshToken: string, isWeb: boolean, res: Response): Promise<void> {

        return new Promise<void>(async (resolve, reject) => {

            const secret = process.env.REFRESH_TOKEN_SECRET || '';

            const userValidatedData = <any>jwt.verify(refreshToken, secret);

            if (!userValidatedData) return reject({message: 'Invalid credentials'})

            const user = await this.userRepository.getUserByEmail(userValidatedData.email)

            if (!user) throw new Error('Invalid email address')

            const existingRefreshToken: any | [] = user.security.tokens;

            if (existingRefreshToken.length > 0) {
                await this.userRepository.removeRefreshToken(user.email, refreshToken);
            }

            if (isWeb) {
                Cookies.remove(res);
            }
        })
    }

    public revalidateUser(refreshToken: string): Promise<reAuthType> {

        return new Promise(async (resolve, reject) => {

            const decoded = <any> jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "");

            if (!decoded) return reject({message: 'Invalid token'})

            const user = await this.userRepository.getUserByEmail(decoded.email)

            if (!user) return reject({message: 'Unauthorized account'})

            if (refreshToken)
            {
                const existingRefreshToken : any[] = user.security.tokens;

                if (existingRefreshToken.some(token => token.refreshToken === refreshToken)) {
                    const accessToken = await this.userRepository.generateAccessToken(user);
                    return resolve({
                        accessToken,
                        user
                    })
                }
            }
            throw new Error('No refresh token found')
        })
    }

    public uploadImage(file: FileProps):Promise<string> {
        return new Promise(async (resolve, reject) => {
            await fileUploader(file, 'user', async (error: unknown, uri: string) => {
                if (error) return reject({message: error});
                await this.userRepository.updateUserFields(Auth.user().email, {image: uri})
                return resolve(uri);
            })
        })
    }

}