import { type Session } from '@prisma/client';
import { type inferProcedureInput } from '@trpc/server';
import { appRouter } from '@root/app/server/api/root';
import { db } from '@root/app/server/db';

test("get check", async () => {
    const mockSession: Session | null = null;

    const caller = appRouter.createCaller({
        session: mockSession,
        db,
        headers: new Headers(),
    });

    type Input = inferProcedureInput<typeof appRouter['health']['check']>;

    const input: Input = void 0;

    const result = await caller.health.check(input);

    expect(result.status).toBe('ok');
});