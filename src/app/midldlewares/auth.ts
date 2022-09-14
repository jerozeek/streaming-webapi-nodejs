import {NextFunction, Request, Response} from "express";
import validations from "../entities/Rules/validations";
import {throw_exception} from "../utils/exceptions";
import {createUserProps, UserProp, userRepositoryInterface} from "../repositories/interfaces";
import {UserRepository} from "../repositories/userRepository";
import {RegisterEntity} from "../entities/User/registerEntity";

export class Auth {

    private static userData: UserProp;

    private static userRepository = new UserRepository() as userRepositoryInterface;

    private static data: any;

    public static async userAuth(req: Request, res: Response, next: NextFunction) {
        const {email, id} = req.user.email;
        await Auth.currentUser(email);
    }

    public static async login(req:Request, res: Response, next: NextFunction) {
        try{
            const data = validations.loginSchema.parse(req.body);
            await Auth.currentUser(data.email);
            next();
        }
        catch (e: any) {
            throw_exception(e.message, res)
        }
    }

    public static async forgetPassword(req:Request, res: Response, next: NextFunction) {
        try{
            const data = validations.fpasswordSchema.parse(req.body);
            await Auth.currentUser(data.email)
            next();
        }
        catch (e: any) {
            throw_exception(e.message, res)
        }
    }

    public static async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validations.signupSchema.parse(req.body);
            const reg = new RegisterEntity(data.name, data.email, data.phone, data.password, req.body.deviceId)
            Auth.data = reg.data();
            next();
        }
        catch (e:any) {
            throw_exception(e.message, res)
        }
    }

    public static user():UserProp {
        return Auth.userData;
    }

    public static signupData(): createUserProps{
        return Auth.data;
    }

    private static async currentUser(email: string) {
        const user = await Auth.userRepository.getUserByEmail(email);
        if (!user) throw new Error('User account not found')
        Auth.setUser(user);
    }

    private static setUser(user: UserProp) {
        Auth.userData = user;
    }

}