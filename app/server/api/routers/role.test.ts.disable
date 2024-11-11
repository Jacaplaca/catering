// src/tests/roleRouter.test.ts
import { type inferProcedureInput } from '@trpc/server';
import { appRouter } from '@root/app/server/api/root';
import { db } from '@root/app/server/db';
import { type Session } from 'next-auth';
import getRolesToInvite from '@root/app/server/lib/roles/getRolesToInvite';
import { getDict } from '@root/app/server/cache/translations';

// Mock the imported modules
jest.mock('@root/app/server/db');
jest.mock('@root/app/server/cache/translations', () => {
    return {
        getDict: jest.fn(),
    };
});
jest.mock('@root/app/server/lib/roles/getRolesToInvite');


describe("roleRouter - getRolesToInvite", () => {
    const mockSession: Session = {
        user: {
            name: 'Jacek Kowalczyk',
            email: 'bikerhill@gmail.com',
            image: 'https://lh3.googleusercontent.com/a/ACg8ocI3NyMnL6gc6fa0RegwTQsrPFHv6f_JixYPRJmeJP4qVPx7LXI=s96-c',
            id: 'clvwdyckj0000ra0oev7r4axb',
            // role: { id: 'superAdmin', inviteBy: [], group: 'system', order: 1 },
            roleId: 'superAdmin',
            hasPassword: false,
            emailVerified: true,
            web3Address: null
        },
        expires: '2029-09-29T14:00:00.000Z',
    };
    it("should get roles to invite with translations", async () => {

        const caller = appRouter.createCaller({
            session: mockSession,
            db,
            headers: new Headers(),
        });

        type Input = inferProcedureInput<typeof appRouter['role']['getRolesToInvite']>;

        const input: Input = { lang: 'en' };

        (getRolesToInvite as jest.Mock).mockResolvedValue([
            { id: 'role1', group: 'group1' },
            { id: 'role2', group: 'group2' },
        ]);

        (getDict as jest.Mock).mockImplementation(({ group }) => {
            if (group === 'role') {
                return {
                    role1: 'Role 1 Translation',
                    role2: 'Role 2 Translation',
                };
            }
            return {
                [`${group}:role1`]: `Role 1 Translation`,
                [`${group}:role2`]: `Role 2 Translation`,
            };
        });

        const result = await caller.role.getRolesToInvite(input);

        expect(result).toEqual([
            { value: 'role1', label: 'Role 1 Translation' },
            { value: 'role2', label: 'Role 2 Translation' },
        ]);
    });

    it("should return empty array if no roles to invite", async () => {

        const caller = appRouter.createCaller({
            session: mockSession,
            db,
            headers: new Headers(),
        });

        type Input = inferProcedureInput<typeof appRouter['role']['getRolesToInvite']>;

        const input: Input = { lang: 'en' };

        (getRolesToInvite as jest.Mock).mockResolvedValue([]);
        (getDict as jest.Mock).mockResolvedValue({});

        const result = await caller.role.getRolesToInvite(input);

        expect(result).toEqual([]);
    });
});
