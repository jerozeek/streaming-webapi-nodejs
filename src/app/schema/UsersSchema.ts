import {prop, getModelForClass, mongoose, modelOptions, Severity} from '@typegoose/typegoose';
import {TimeStamps} from "@typegoose/typegoose/lib/defaultClasses";
import {expiryTimeInMinutes, generateRandomNumber} from "../helpers";

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW,
    },
})

class Users extends TimeStamps {

    @prop({ required: true , type: String, lowercase: true })
    name: string;

    @prop({required: true, lowercase: true, type: String, unique: true, trim: true})
    email: string;

    @prop({minlength: 6, required: true, type: String})
    password: string;

    @prop({ required: true, minlength: 11, maxlength: 11, type: String, unique: true, trim: true })
    phone: string;

    @prop({required:false, default: null, type: String })
    deviceId: string;

    @prop({ type: String, default: () => generateRandomNumber(4) })
    otp: string;

    @prop({ type: String, default: () => expiryTimeInMinutes(30) })
    otpExpiry: string;

    @prop({ default: null, type: String })
    image: string;

    @prop({ enum: ['pending', 'active', 'disabled'], default: 'pending', type: String })
    status: string;

    @prop({ default: false, type: Boolean })
    passwordReset: boolean;

    @prop({ required: false, default: {tokens: []}, type: mongoose.Schema.Types.Mixed  })
    security: {tokens: [refreshToken: string, createdAt: string]}

    @prop({ required: false, default: {search: [{name: String}]}, type: mongoose.Schema.Types.Mixed  })
    myList: {search: [{movieId: string}]}

    @prop({ required: false, default: {currency: String, downloadQuality: String, download: String, language: String, autoSubscription: String, enableFingerPrint: String}, type: mongoose.Schema.Types.Mixed  })
    settings: {currency: string, downloadQuality: string, download: string, language: string, autoSubscription: string, enableFingerPrint: string}

    @prop({ type: String, enum: ['user', 'admin'], default: 'user' })
    role: string;

    @prop({ type: String, default: new Date() })
    lastLogin: string
}

const UsersSchema = getModelForClass(Users);

export default UsersSchema;