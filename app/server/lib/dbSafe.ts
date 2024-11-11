import { type PrismaClient } from '@prisma/client';
import { db } from '@root/app/server/db';
import { type Session } from 'next-auth';

type ModelOperation<T, R> = (model: T) => Promise<R>;


const dbSafe = async <
    TModelName extends keyof PrismaClient,
    TResult
>({ modelName, operation }: {
    modelName: TModelName,
    operation: ModelOperation<PrismaClient[TModelName], TResult>
    user?: Session["user"] | null;
    type: 'read' | 'write';
}
): Promise<TResult> => {
    try {
        const model = db[modelName];
        if (!model) {
            throw new Error(`Model ${modelName.toString()} not found`);
        }
        const result = await operation(model);
        return result;
    } catch (error) {
        console.error("Database operation failed:", error);
        throw new Error("Database operation failed");
    }
};

export default dbSafe;