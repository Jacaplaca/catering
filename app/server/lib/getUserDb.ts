// getUserDb.ts
import { db } from "server/db";

export const getUserByEmailFromDB = async (email = "") => {
    return await db.user.findUnique({
        where: {
            email
        },
    })
}

export const getUserByIdFromDB = async (id = "") => {
    return await db.user.findUnique({
        where: {
            id
        },
    })
}