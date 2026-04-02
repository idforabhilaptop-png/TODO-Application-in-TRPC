import { TodoModel } from './schema/todo';
import { UserModel } from './schema/user';
import { router } from './trpc';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import 'dotenv/config';
import mongoose from 'mongoose';
import { userRouter } from './routers/userRouter';
import { todoRouter } from './routers/todoRouter';
import cors from "cors";

const main = async () => {
    await mongoose.connect(process.env.MONGO_URL!)
}

export const appRouter = router({
    user: userRouter,
    todo: todoRouter
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
    router: appRouter,
    middleware: cors(),
    createContext(opts) {
        const authHeader = opts.req.headers["authorization"]
        if (!authHeader?.startsWith("Bearer"))
            return {
                db: {
                    Todo: TodoModel,
                    User: UserModel
                }
            }

        try {
            const token = authHeader.split(" ")[1]
            const { userId } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload
            return {
                userId: userId as string,
                db: {
                    Todo: TodoModel,
                    User: UserModel
                }
            }
        } catch (_err) {
            return {
                db: {
                    Todo: TodoModel,
                    User: UserModel
                }
            }
        }
    }
});

main().then(() => {
    server.listen(3000, () => {
        console.log("Listening to 3000...")
    });
}).catch(err => console.log(`Unable to connect to database: ${(err as Error).message}`))
