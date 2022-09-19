export interface signUpMock {
    name: string,
    email: string,
    password: string,
    phone: string,
    deviceId: string
}

export interface loginMock {
    email: string,
    password: string,
    deviceId: string
}

export const signupData: signUpMock = {
    name: "user2",
    email: "jerozeek2@gmail.com",
    password: "12345678",
    phone: "08101256600",
    deviceId: "web"
}

export const loginData: loginMock = {
    email: "jerozeek2@gmail.com",
    password: "12345678",
    deviceId: "web"
}

export const resetPasswordCredentials = {
    email: "jerozeek2@gmail.com",
    password: "12345678",
    confirmPassword: "12345678",
}