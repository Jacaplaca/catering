/* eslint-disable @typescript-eslint/unbound-method */
// autoAssignRoleToUser.test.ts

import { PrismaClient } from '@prisma/client';
import autoAssignRoleToUser from '@root/app/server/lib/roles/autoAssignRoleToUser';
import { getUserByIdFromDB } from '@root/app/server/lib/getUserDb';
import { removeExpiredInviteTokens } from '@root/app/lib/removeExpiredTokens';
import assignRoleToUser from '@root/app/server/lib/roles/assignRoleToUser';
import assignAutoRoleDuringConfirmation from '@root/app/server/lib/roles/assignAutoRoleDuringConfirmation';

const prisma = new PrismaClient();

// Mock the prisma client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        inviteToken: {
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

jest.mock('@root/app/server/lib/roles/assignRoleToUser', () => jest.fn());
jest.mock('@root/app/server/lib/roles/assignAutoRoleDuringConfirmation', () => jest.fn());
jest.mock('@root/app/server/lib/getUserDb', () => ({
    getUserByIdFromDB: jest.fn(),
}));
jest.mock('@root/app/lib/removeExpiredTokens', () => ({
    removeExpiredInviteTokens: jest.fn(),
}))

describe('autoAssignRoleToUser', () => {
    it('should do nothing if userId is not provided', async () => {
        const result = await autoAssignRoleToUser({});
        expect(result).toBeUndefined();
    });

    it('should do nothing if user is not found in the database', async () => {
        const mockGetUserByIdFromDB = getUserByIdFromDB as jest.Mock;
        mockGetUserByIdFromDB.mockResolvedValue(null);

        const result = await autoAssignRoleToUser({ userId: 'user1' });
        expect(mockGetUserByIdFromDB).toHaveBeenCalledWith('user1');
        expect(result).toBeUndefined();
    });

    it('should do nothing if user already has a role', async () => {
        const mockGetUserByIdFromDB = getUserByIdFromDB as jest.Mock;
        mockGetUserByIdFromDB.mockResolvedValue({ id: 'user1', roleId: 'role1' });

        const result = await autoAssignRoleToUser({ userId: 'user1' });
        expect(mockGetUserByIdFromDB).toHaveBeenCalledWith('user1');
        expect(result).toBeUndefined();
    });

    it('should assign role based on invite token if it is valid', async () => {
        const mockGetUserByIdFromDB = getUserByIdFromDB as jest.Mock;
        const mockRemoveExpiredInviteTokens = removeExpiredInviteTokens as jest.Mock;
        const mockInviteTokenFindUnique = prisma.inviteToken.findUnique as jest.Mock;

        const mockAssignRoleToUser = assignRoleToUser as jest.Mock;
        const mockInviteTokenDelete = prisma.inviteToken.delete as jest.Mock;

        mockGetUserByIdFromDB.mockResolvedValue({ id: 'user1', role: null });
        mockRemoveExpiredInviteTokens.mockResolvedValue(undefined);
        mockInviteTokenFindUnique.mockResolvedValue({
            id: 'token1',
            token: 'valid-token',
            expires: new Date(Date.now() + 1000 * 60 * 60),
            inviterId: 'inviter1',
            inviter: { id: 'inviter1' },
            role: { id: 'role1' }
        });

        const result = await autoAssignRoleToUser({ userId: 'user1', inviteToken: 'valid-token' });

        expect(mockGetUserByIdFromDB).toHaveBeenCalledWith('user1');
        expect(mockRemoveExpiredInviteTokens).toHaveBeenCalled();
        expect(mockInviteTokenFindUnique).toHaveBeenCalledWith({
            where: {
                token: 'valid-token',
                expires: {
                    gt: expect.any(Date) as Date
                }
            },
            include: {
                inviter: true,
                role: true
            }
        });
        expect(mockAssignRoleToUser).toHaveBeenCalledWith({ userId: 'user1', inviterId: 'inviter1', roleId: 'role1' });
        expect(mockInviteTokenDelete).toHaveBeenCalledWith({
            where: {
                id: 'token1'
            }
        });
        expect(result).toBeUndefined();
    });

    it('should assign auto role during confirmation if no valid invite token is provided', async () => {
        const mockGetUserByIdFromDB = getUserByIdFromDB as jest.Mock;
        const mockInviteTokenFindUnique = prisma.inviteToken.findUnique as jest.Mock;
        const mockAssignAutoRoleDuringConfirmation = assignAutoRoleDuringConfirmation as jest.Mock;

        mockGetUserByIdFromDB.mockResolvedValue({ id: 'user1', role: null });
        mockInviteTokenFindUnique.mockResolvedValue(null);
        mockAssignAutoRoleDuringConfirmation.mockResolvedValue(undefined);

        const result = await autoAssignRoleToUser({ userId: 'user1', inviteToken: 'invalid-token' });

        expect(mockGetUserByIdFromDB).toHaveBeenCalledWith('user1');
        expect(mockInviteTokenFindUnique).toHaveBeenCalledWith({
            where: {
                token: 'invalid-token',
                expires: {
                    gt: expect.any(Date) as Date
                }
            },
            include: {
                inviter: true,
                role: true
            }
        });
        expect(mockAssignAutoRoleDuringConfirmation).toHaveBeenCalledWith('user1');
        expect(result).toBeUndefined();
    });
});
