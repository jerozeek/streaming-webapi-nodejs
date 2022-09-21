import { Router } from 'express';
import {use} from "../utils/use";
import {throttle} from "../midldlewares/throttle";
import authRoute from './authRoutes';
import userRoute from './userRoute';
import {Auth} from "../midldlewares/auth";
import {verifyToken} from "../midldlewares/verifyToken";

const route = Router();

/**
 * Authentication Routes
 */
route.post('/auth/login', [Auth.login, throttle()], use(authRoute.login))
route.post('/auth/register', [Auth.signup, throttle()], use(authRoute.signup))
route.post('/auth/forget-password', [Auth.forgetPassword, throttle()], use(authRoute.forgetPassword))
route.post('/auth/verify-otp', [Auth.otpVerification, throttle()], use(authRoute.verifyOtp))
route.post('/auth/reset-password', [Auth.resetPassword, throttle()], use(authRoute.resetPassword))
route.post('/auth/logout', [throttle()], use(authRoute.logout)) //For mobile
route.get('/auth/logout', [throttle()], use(authRoute.logout)) //For web
route.get('/auth/revalidate-token/:channel', [throttle()], use(authRoute.revalidateToken)) //for web
route.post('/auth/revalidate-token/:channel', [throttle()], use(authRoute.revalidateToken)) //for mobile

/**
 * User Routes
 */
route.post('/user/change-password', [verifyToken, throttle()], use(userRoute.updatePassword))
route.post('/user/upload-image', [verifyToken, throttle()], use(userRoute.updatePassword))

export = route;