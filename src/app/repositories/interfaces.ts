type userSettings = {
    currency: string,
    downloadQuality: string,
    download: string,
    language: string,
    autoSubscription: string,
    enableFingerPrint: string
}

type userSecurity = {
    tokens: [refreshToken: string, createdAt: string]
}

type userMovieList = [
    { id: string }
]

export interface UserProp {
    id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    image: string | null;
    otp: string;
    status: string;
    passwordReset: boolean;
    otpExpiry: string;
    deviceId: string | null;
    role: string;
    security: userSecurity;
    settings: userSettings;
    myList?: userMovieList;
    lastLogin: string;
    socialAuth: string | null;
}


export interface createUserProps {
    email: string;
    password: string;
    name: string;
    phone: string;
    deviceId: string;
    lastLogin: string;
}

export interface userRepositoryInterface {
    getUserByEmail: (email: string) => Promise<UserProp>
    create: (payload: createUserProps) => Promise<UserProp>
    generateAccessToken: (user: UserProp) => Promise<string | null>
    generateRefreshToken: (user: UserProp) => Promise<string | null>
    createLogin: (email: string, deviceId: string) => Promise<UserProp>
    updateUserFields: (email: string, data: object) => Promise<UserProp>
    removeRefreshToken: (email: string, refreshToken: string) => Promise<void>
}