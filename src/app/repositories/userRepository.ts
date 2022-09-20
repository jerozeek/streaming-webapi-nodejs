import UsersSchema from "../schema/UsersSchema";
import {createUserProps, UserProp, userRepositoryInterface} from "./interfaces";
import jwt from "jsonwebtoken";

export class UserRepository implements userRepositoryInterface {

    public async getUserByEmail(email: string) {
        return await UsersSchema.findOne({email}) as UserProp;
    }

    public async create(payload: createUserProps) {
        return await UsersSchema.create(payload) as unknown as UserProp;
    }

    public async generateAccessToken(user: UserProp): Promise <string | null> {
        const tokenKey = process.env.ACCESS_TOKEN_SECRET || '';
        const expiryTime = process.env.ACCESS_TOKEN_EXPIRY || '1h';
        const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role},tokenKey, { expiresIn: expiryTime});
        if (accessToken) return accessToken;
        return null;
    }

    public async generateRefreshToken (user: UserProp): Promise <string | null> {
        const tokenKey = process.env.REFRESH_TOKEN_SECRET || '';
        const expiryTime = process.env.REFRESH_TOKEN_EXPIRY || '30d';
        const refreshToken = jwt.sign({ id: user.id, email: user.email, role: user.role}, tokenKey, { expiresIn: expiryTime});
        try{
            const existingRefreshToken: any | [] = user.security.tokens;
            if (existingRefreshToken.length < 5)
            {
                //generate new refresh token
                await UsersSchema.updateOne({email: user.email}, {$push: {"security.tokens": {refreshToken, createdAt: new Date()}}});
            }
            else
            {
                //pull all token out from the box....
                await UsersSchema.updateOne({email: user.email}, {$pull: {"security.tokens": {_id: existingRefreshToken[0]._id}}});

                //push a new token........
                await UsersSchema.updateOne({email: user.email}, {$push: {"security.tokens": {refreshToken, createdAt: new Date()}}});
            }

            return refreshToken;
        }
        catch (e) {
            return null;
        }
    }

    public async createLogin(email: string, deviceId: string) {
        return await UsersSchema.findOneAndUpdate({email}, {$set: {deviceId}}, {new: true}) as UserProp
    }

    public async updateUserFields(email: string, data:object) {
        return await UsersSchema.findOneAndUpdate({email}, {$set: data}, {new: true}) as UserProp;
    }

    public async removeRefreshToken(email: string, refreshToken: string): Promise<void> {
        await UsersSchema.updateOne({email}, {$pull: {"security.tokens": {refreshToken}}});
    }

}