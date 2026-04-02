import { initTRPC } from '@trpc/server';
import { TodoModel } from './schema/todo';
import { UserModel } from './schema/user';

const t = initTRPC.context<
    {
        db: {
            Todo: typeof TodoModel,
            User: typeof UserModel
        },
        userId?: string;
    }
>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
