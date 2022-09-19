import { Router } from 'express';
import {use} from "../utils/use";
import {throttle} from "../midldlewares/throttle";
import authRoute from './authRoutes';
import {Auth} from "../midldlewares/auth";

const route = Router();

route.post('/auth/login', [Auth.login, throttle()], use(authRoute.login))
route.post('/auth/register', [Auth.signup, throttle()], use(authRoute.signup))
route.post('/auth/forget-password', [Auth.forgetPassword, throttle()], use(authRoute.forgetPassword))
route.post('/auth/verify-otp', [Auth.otpVerification, throttle()], use(authRoute.verifyOtp))
route.post('/auth/reset-password', [Auth.resetPassword, throttle()], use(authRoute.resetPassword))
route.post('/auth/logout', [throttle()], use(authRoute.logout))
route.get('/auth/logout', [throttle()], use(authRoute.logout))

export = route;