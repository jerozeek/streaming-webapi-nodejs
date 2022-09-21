import {expiryTimeInMinutes, generateRandomNumber, now} from "./index";
import {userRepositoryInterface} from "../repositories/interfaces";
import {UserRepository} from "../repositories/userRepository";
import {Auth} from "../midldlewares/auth";
import {emailSubscriber} from "../events/Observers/Notification/Subscribers/EmailSubscriber";

export class Otp {

    static userRepository: userRepositoryInterface = new UserRepository();

    private static otp: string;

    private static expiry: number;

    static async set(type: number, email: string, passwordReset: boolean = false) {
        switch (type) {
            case 1:
                return Otp.accountActivation(email)
            case 2 :
                return Otp.passwordReset(email)
            case 3 :
                return Otp.resetOtp(email, passwordReset)
        }
    }

    static async resetOtp(email: string, passwordReset: boolean = false) {
        Otp.create();
        Otp.createExpiryTime()
        return Otp.userRepository.updateUserFields(email, {
            otp: Otp.otp,
            passwordReset,
            otpExpiry: Otp.expiry
        });
    }

    static async accountActivation(email: string):Promise<boolean> {
        await Otp.resetOtp(email);
        //send in an email
        emailSubscriber(email, 'Password Reset','activation', {otp: Otp.otp})
        return true;
    }

    static async passwordReset(email: string): Promise<boolean> {
        await Otp.resetOtp(email, true);
        //send in an email
        emailSubscriber(email, 'Password Reset','password_reset', {otp: Otp.otp})
        return true;
    }

    static create (): void {
        Otp.otp = generateRandomNumber(4);
    }

    static createExpiryTime (timeInMinute: number = 30):void {
        Otp.expiry = expiryTimeInMinutes(timeInMinute);
    }

    static compare(): boolean {

        if (now > Number(Auth.user().otpExpiry)) return false;

        return Auth.user().otp === Auth.otp;
    }
}