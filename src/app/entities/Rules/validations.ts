import {z} from 'zod';

const loginSchema = z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(6,'Password must be at least 6 characters long'),
    deviceId: z.string().optional(),
})

export = {
    loginSchema
}