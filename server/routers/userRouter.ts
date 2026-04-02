import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import { z } from "zod"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const authSchema = z.object({
    username: z.string()
        .min(5, "Email too short")
        .max(100, "Email too long")
        .email("Please follow correct email format"),

    password: z.string().min(8, "Password must be at least 8 characters")
        .max(64, "Password too long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
})

export const userRouter = router({
    signup: publicProcedure
        .input(authSchema)
        .mutation(async (opts) => {
            const username = opts.input.username
            const password = opts.input.password

            const isUserExist = await opts.ctx.db.User.findOne({ username })
            if (isUserExist) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "User already exists"
                })
            }
            await opts.ctx.db.User.create({
                username,
                password: await bcrypt.hash(password, 10)
            })
            return {
                message: "Signed up successfully"
            }
        }),

    signin: publicProcedure
        .input(authSchema)
        .mutation(async (opts) => {
            const username = opts.input.username
            const password = opts.input.password

            const isUserExist = await opts.ctx.db.User.findOne({ username })
            if (!isUserExist) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User does not exist"
                })
            }
            const passwordMatch = await bcrypt.compare(password, isUserExist.password as string)
            if (!passwordMatch) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Invalid Credentials"
                })
            }
            const token = jwt.sign({ userId: isUserExist._id }, process.env.SECRET_KEY!, { expiresIn: "1h" })
            return {
                token: token
            }

        })
})
