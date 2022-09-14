import {expiryTimeInMinutes, generateRandomNumber, now} from "./index";
import {userRepositoryInterface} from "../repositories/interfaces";
import {UserRepository} from "../repositories/userRepository";


export class Otp {

    static userRepository: userRepositoryInterface = new UserRepository();

    static async set(type: number, email: string) {
        switch (type) {
            case 1:
                return Otp.accountActivation(email)
            case 2 :
                return Otp.passwordReset(email)
        }
    }

    static async accountActivation(email: string):Promise<boolean> {
        await Otp.userRepository.updateUserFields(email, {
            otp: Otp.create(),
            otpExpiry: Otp.createExpiryTime()
        });
        return true;
    }

    static async passwordReset(email: string): Promise<boolean> {
        await Otp.userRepository.updateUserFields(email, {
            passwordReset: true,
            otp: Otp.create(),
            otpExpiry: Otp.createExpiryTime()
        });
        return true;
    }

    static create (): string {
        return generateRandomNumber(4);
    }

    static createExpiryTime (timeInMinute: number = 30) {
        return expiryTimeInMinutes(timeInMinute);
    }

    static compare(code: string, otp: string, expiryTime: string): boolean {

        if (now > Number(expiryTime)) return false;

        return code === otp;
    }
}