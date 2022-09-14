import {UserProp} from "../repositories/interfaces";

export class UserResource {

    protected userData: UserProp | any;

    protected userArrayData: Array<object>;

    constructor(user: UserProp | UserProp[]) {
        if(Array.isArray(user)) {
            user.forEach((value) => {
                this.set(value)
            })
            this.userArrayData = [...this.userArrayData, this.userData]
        }
        else this.set(user);
    }

    private set(user: UserProp) {
        this.userData = {
            name: user.name,
            email: user.email,
            image: user.image,
            status: user.status,
            lastLogin: user.lastLogin,
            settings: user.settings,
            myList: user.myList,
            deviceId: user.deviceId,
            role: user.role,
            passwordReset: user.passwordReset,
            otp: user.otp,
            otpExpiry: user.otpExpiry
        }
    }

    public all() {
        return this.userData;
    }

    public withOut (data: Array<string>){
        const usersKeys = Object.keys(this.userData);
        for (const userKey of usersKeys) {
            data.forEach((value => {
                if (value === userKey) {
                    delete this.userData[value];
                }
            }))
        }
        return this.userData;
    }

    public collections() {
        return this.userArrayData;
    }
}