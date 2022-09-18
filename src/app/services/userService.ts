import {serviceInterface} from './interfaces';
import {UserProp, userRepositoryInterface} from "../repositories/interfaces";
import {Auth} from "../midldlewares/auth";
import { KeyPatternErrorMessage } from "../helpers";
import {Password} from "../helpers/password";
import {Otp} from "../helpers/otp";

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

                if (user.status === 'pending') await Otp.set(1, user.email)

                return resolve(newUserObject)
            }

            return reject({message: 'Invalid login credentials'})
        })
    }

    public signup(): Promise<UserProp> {

        return new Promise(async (resolve, reject) => {

            const payload       = Auth.signupData();

            await this.userRepository.create(payload).then(async (result) => {

                await Otp.set(1, payload.email)

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

    public async verifyOtp(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (Otp.compare()) {
                await this.resetOtp(Auth.user().email, true);
                return resolve(true)
            }
            return reject(false);
        })
    }

    private async resetOtp(email: string, passwordReset: boolean = true): Promise<boolean> {
        //update the otp...
        await Otp.set(3, email, passwordReset)
        return true
    }

}