import {describe, expect, it, afterAll, beforeAll, afterEach} from "@jest/globals";
import request from "supertest";
import {Handler} from "../../handler";
import {loginData, resetPasswordCredentials, signupData} from "../mocks/mock";
import {DEFAULT_PATH} from "../../utils/util";
import {UserRepository} from "../../repositories/userRepository";
import {emailSubscriber} from "../../events/Observers/Notification/Subscribers/EmailSubscriber";
import sinon from 'sinon';

const userRepository = new UserRepository();


const repositorySpy = sinon.spy();
repositorySpy(userRepository.create);

const emailSpy = sinon.spy();
emailSpy(emailSubscriber)

beforeAll(() => {
    return Handler.startServer();
})

afterEach(async () => {
    //await Handler.dropCollections();
})

afterAll( async () => {
    await Handler.dropMongoDB();
    return Handler.closeServer();
})

describe('Authentication suite', () => {

    const mockPostRequest = async (route: string, data: any) => {
        return request(Handler.app).post(`${DEFAULT_PATH}/${route}`).send(data);
    }

    describe('Registration route test suite', () => {

        it('return error if invalid email address', async () => {
            const res = await mockPostRequest('auth/register', {...signupData, email:'test'});
            expect(res.statusCode).toEqual(500);
        })

        it('return error if invalid phone number length', async () => {
            const res = await mockPostRequest('auth/register', {...signupData, phone:'0902345643'});
            expect(res.statusCode).toEqual(500);
        })

        it('return 200 if signup is valid', async () => {
            const res = await mockPostRequest('auth/register', signupData);
            expect(res.body.message).toEqual('An OTP have been sent to your email.')
            expect(res.statusCode).toBe(200)
            expect(repositorySpy).toHaveBeenCalled()
            expect(emailSpy).toHaveBeenCalled()
        })

        it('return duplicate email', async () => {
            const res = await mockPostRequest('auth/register', signupData);
            expect(res.body.message).toEqual('email already exists.')
            expect(res.statusCode).toBe(400)
        })

        it('return duplicate phone', async () => {
            const res = await mockPostRequest('auth/register', {...signupData, email: "tester@gmail.com"});
            expect(res.body.message).toEqual('phone already exists.')
            expect(res.statusCode).toBe(400)
        })
    })

    describe('Login routes test suite', () => {

        it('Return error if the password length is not above 6', async () => {
            const res = await mockPostRequest('auth/login', {...loginData, password: "1234"});
            expect(res.statusCode).toEqual(500)
        })

        it('Return object if login credentials are correct and account is not active.', async () => {
            const res = await mockPostRequest('auth/login', loginData);
            expect(res.statusCode).toEqual(200)
            expect(res.body.message).toMatch('An OTP have been sent to your email.')
            expect(res.body).toStrictEqual({
                status: 200,
                message: "An OTP have been sent to your email.",
                data: {
                    email: loginData.email
                }
            })
        })

    })

    describe("Forget password route test suite", () => {

        it('return error if email is invalid', async () => {
            const res = await mockPostRequest('auth/forget-password', {email: 'test'})
            expect(res.statusCode).toBe(500)
        })

        it('return error if email is not found', async () => {
            const res = await mockPostRequest('auth/forget-password', {email: 'test@gmail.com'})
            expect(res.statusCode).toBe(500)
            expect(res.body.message).toEqual("User account not found")
        })

        it("Send an email to the user if email is valid", async () => {
            const res = await mockPostRequest('auth/forget-password', {email: loginData.email})
            expect(res.statusCode).toEqual(200)
            expect(res.body.message).toStrictEqual("An OTP have been sent to your email")
            expect(res.body.data).toEqual({email: loginData.email})
            //expect(spy).toHaveBeenCalled()
        })
    })

    describe("Update Password route test suite", () => {

        it("return error if password length is less than 6", async () => {
            const res = await mockPostRequest('auth/reset-password', {...resetPasswordCredentials, password: "1234"});
            expect(res.statusCode).toEqual(500)
        })

        it("return error if password do not match", async () => {
            const res = await mockPostRequest('auth/reset-password', {...resetPasswordCredentials, password: "12233445"});
            expect(res.statusCode).toEqual(500)
            expect(res.body.message).toEqual('Confirm password do not match password')
        })

        it("return error if email is invalid", async () => {
            const res = await mockPostRequest('auth/reset-password', {...resetPasswordCredentials, email: "test"});
            expect(res.statusCode).toEqual(500)
        })

        it("return error if email is not found", async () => {
            const res = await mockPostRequest('auth/reset-password', {...resetPasswordCredentials, email: "test@gmail.com"});
            expect(res.statusCode).toEqual(500)
            expect(res.body.message).toEqual('User account not found')
        })

        it("return error if password reset object is false", async () => {
            const res = await mockPostRequest('auth/reset-password', resetPasswordCredentials);
            expect(res.statusCode).toEqual(200)
            expect(res.body.message).toEqual('Password updated successfully')
        })
    })
})