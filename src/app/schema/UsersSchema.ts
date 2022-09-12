import {prop, getModelForClass, mongoose, modelOptions, Severity} from '@typegoose/typegoose';
import {TimeStamps} from "@typegoose/typegoose/lib/defaultClasses";

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

    @prop({required:false, default: null, type: mongoose.Schema.Types.Mixed })
    deviceInfo: object;

    @prop({ default: 'user', type: String, enum: ['user','admin'] })
    accountType: string;

    @prop({ default: 1, type: Number })
    tier: number;

    @prop({ default: 0, type: Number })
    escrow: number;

    @prop({ default: 0, type: Number })
    balance: number;

    @prop({ type: String, default: null })
    otp: string;

    @prop({ type: String, default: null })
    otpExpiry: string;

    @prop({ default: 0, type: Number })
    test_escrow: number;

    @prop({ default: 0, type: Number })
    test_balance: number;

    @prop({ default: null, type: String })
    image: string;

    @prop({ enum: ['pending', 'active', 'disabled'], default: 'pending', type: String })
    status: string;

    @prop({ default: false, type: Boolean })
    passwordReset: boolean;

    @prop({ default: null, type: String })
    passwordResetExpiry: string;

    @prop({ required: false, default: {tokens: []}, type: mongoose.Schema.Types.Mixed  })
    security: {tokens: [refreshToken: string, createdAt: string]}

    @prop({ required: false, default: {search: [{name: String}]}, type: mongoose.Schema.Types.Mixed  })
    searchHistory: {search: [{name: string}]}

    @prop({ required: false, default: {search: [{name: String}]}, type: mongoose.Schema.Types.Mixed  })
    watchList: {search: [{name: string}]}

    @prop({ required: false, default: {downloaded: [{type: String}]}, type: mongoose.Schema.Types.Mixed  })
    movies: {downloaded: [{type: string}]}

    @prop({ required: false, default: {tokens: []}, type: mongoose.Schema.Types.Mixed  })
    settings: {currency: string, downloadQuality: string, download: string, language: string, autoSubscription: string, enableFingerPrint: string}

    @prop({ type: String, enum: ['user', 'admin'], default: 'user' })
    role: string;

    @prop({ maxlength: 6, default: null, type: String, unique: true })
    coupon: string;

    @prop({ default: 0, type: Number })
    couponWallet: number;

    @prop({ default: null, type: String })
    referral: string;

    @prop({ type: String, default: new Date() })
    lastLogin: string

    @prop({ required: false, default:0, type: Number })
    rating: number;
}

const UsersSchema = getModelForClass(Users);

export default UsersSchema;