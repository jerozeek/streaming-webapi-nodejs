import {z} from 'zod';

const loginSchema = z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(6,'Password must be at least 6 characters long'),
    deviceId: z.string().optional(),
})

const fpasswordSchema = z.object({
    email: z.string().trim().email('Invalid email address'),
})

const otpSchema = z.object({
    email: z.string().trim().email('Invalid email address'),
    otp: z.string().min(4).max(6),
})

const signupSchema = z.object({
    name: z.string().trim(),
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(6,'Password must be at least 6 characters long'),
    phone: z.string().min(11).max(14),
})

export = {
    loginSchema,
    signupSchema,
    fpasswordSchema,
    otpSchema
}