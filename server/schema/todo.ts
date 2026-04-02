import { Schema, model, Document, Types } from "mongoose";

interface ITodo extends Document {
    title: string;
    description: string;
    done: boolean;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        done: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const TodoModel = model<ITodo>("todos", TodoSchema);

export { TodoModel, ITodo };
