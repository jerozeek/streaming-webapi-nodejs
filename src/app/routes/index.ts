import { Router } from 'express';
import {use} from "../utils/use";
import {throttle} from "../midldlewares/throttle";
import authRoute from './authRoutes';

const route = Router();

route.post('/auth/login', [throttle()], use(authRoute.login))
route.post('/auth/register', [throttle()], use(authRoute.signup))
route.post('/auth/forget-password', [throttle()], use(authRoute.forgetPassword))

export = route;