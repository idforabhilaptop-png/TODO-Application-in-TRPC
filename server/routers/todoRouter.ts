import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { isSignedin } from "../middleware/userMiddleware";


const todoSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    description: z.string().max(500, "Description too long"),
})

export const todoRouter = router({

    todoCreate: publicProcedure
        .use(isSignedin)
        .input(todoSchema)
        .mutation(async (opts) => {
            const { title, description } = opts.input

            const isTodoExist = await opts.ctx.db.Todo.findOne({
                title,
                userId: opts.ctx.userId
            })
            if (isTodoExist) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Todo already exists"
                })
            }

            await opts.ctx.db.Todo.create({
                title,
                description,
                userId: opts.ctx.userId
            })

            return { message: "Todo created successfully" }
        }),

    todoGetAll: publicProcedure
        .use(isSignedin)
        .query(async (opts) => {
            const todos = await opts.ctx.db.Todo.find({ userId: opts.ctx.userId })
            return { todos }
        }),

    todoUpdate: publicProcedure
        .use(isSignedin)
        .input(z.object({
            id: z.string(),
            title: z.string().min(1).max(100).optional(),
            description: z.string().max(500).optional(),
            done: z.boolean().optional()
        }))
        .mutation(async (opts) => {
            const { id, ...updates } = opts.input

            const todo = await opts.ctx.db.Todo.findOne({
                _id: id,
                userId: opts.ctx.userId
            })
            if (!todo) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Todo not found"
                })
            }

            await opts.ctx.db.Todo.findByIdAndUpdate(id, updates)
            return { message: "Todo updated successfully" }
        }),


    todoDelete: publicProcedure
        .use(isSignedin)
        .input(z.object({
            id: z.string()
        }))
        .mutation(async (opts) => {
            const { id } = opts.input

            const todo = await opts.ctx.db.Todo.findOne({
                _id: id,
                userId: opts.ctx.userId
            })
            if (!todo) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Todo not found"
                })
            }

            await opts.ctx.db.Todo.findByIdAndDelete(id)
            return { message: "Todo deleted successfully" }
        }),
})
