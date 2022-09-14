import bcrypt from 'bcrypt';
import {Password} from "../../helpers/password";


export class RegisterEntity {

    public name;
    public email;
    public phone;
    public password;
    public deviceId;

    constructor(name: string, email: string, phone: string, password: string, deviceId: string | null) {
        this.email      = email;
        this.name       = name;
        this.phone      = phone;
        this.password   = password;
        this.deviceId   = deviceId;
    }

    public data () {
        return {
            name: this.name,
            email: this.email,
            phone: this.phone,
            password: Password.hash(this.password),
            deviceId: this.deviceId,
            lastLogin: new Date(),
        }
    }

}