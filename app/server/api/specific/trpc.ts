import { TRPCError } from "@trpc/server";
import { db } from '@root/app/server/db';
import { allowActiveApp, t, timingMiddleware } from '@root/app/server/api/trpc';
import { type RoleType } from '@prisma/client';
import hasFinishedSettings from '@root/app/server/api/routers/specific/libs/hasFinishedSettings';
import { type Session } from "next-auth"; // Zakładając, że używasz next-auth
import { type Catering } from "@prisma/client";

export interface ExtendedSession extends Session {
    user: Session['user'] & {
        roleId: string;
        cateringId: string;
    };
    catering: Catering;
}

export interface Context {
    session: ExtendedSession;
    db: typeof db;
}

const enforceUserHasCatering = ({
    allowedRoles,
    expectSettings = true,
}: {
    allowedRoles?: RoleType[] | RoleType
    expectSettings?: boolean
}) => {
    return t.middleware(async ({ ctx, next }) => {
        if (!ctx.session || !ctx.session.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const userRole = ctx.session.user.roleId;

        if (allowedRoles) {
            if (!allowedRoles.includes(userRole)) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }
        }

        const cateringId = ctx.session.user.cateringId;

        if (cateringId == null) {
            throw new TRPCError({ code: "FORBIDDEN" });
        }

        if (typeof cateringId !== "string") {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid cateringId" });
        }

        const catering = await db.catering.findUnique({
            where: { id: cateringId },
        });

        if (!catering) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Catering not found" });
        }

        const finishedSettings = expectSettings
            ? await hasFinishedSettings({
                roleId: userRole,
                userId: ctx.session.user.id,
                catering,
            })
            : true;

        if (!finishedSettings) {
            throw new TRPCError({ code: "FORBIDDEN", message: "User settings not finished" });
        }

        return next({
            ctx: {
                session: { ...ctx.session, user: ctx.session.user, catering },
            },
        });
    });
};

export const createCateringProcedure = (allowedRoles?: RoleType[] | RoleType) => {
    if (typeof allowedRoles === "string") {
        allowedRoles = [allowedRoles];
    }
    return t.procedure
        .use(allowActiveApp)
        .use(timingMiddleware)
        .use(enforceUserHasCatering({ allowedRoles, expectSettings: true }))
        .use(({ ctx, next }) => {
            // Tutaj możemy użyć naszego nowego typu Context
            const typedCtx: Context = ctx as Context;
            return next({ ctx: typedCtx });
        });
};

export const createCateringNotSettingsProcedure = (allowedRoles?: RoleType[] | RoleType) => {
    if (typeof allowedRoles === "string") {
        allowedRoles = [allowedRoles];
    }
    return t.procedure
        .use(allowActiveApp)
        .use(timingMiddleware)
        .use(enforceUserHasCatering({ allowedRoles, expectSettings: false }));
};