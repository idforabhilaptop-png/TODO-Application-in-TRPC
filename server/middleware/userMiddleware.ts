import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";

export const isSignedin = middleware(async (opts) => {
    if (!opts.ctx.userId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Please Sign in!"
        })
    }
    const isUserExist = await opts.ctx.db.User.findOne({ _id: opts.ctx.userId })
    if (!isUserExist) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invalid Token. Sign in"
        })
    }
    return opts.next({
        ctx: {
            ...opts.ctx,
            userId: String(isUserExist._id)
        }
    })
})
