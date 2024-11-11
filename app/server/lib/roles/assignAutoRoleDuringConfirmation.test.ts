/* eslint-disable @typescript-eslint/unbound-method */
// assignRoleToUser.test.ts

import { PrismaClient } from '@prisma/client';
import assignAutoRoleDuringConfirmation from '@root/app/server/lib/roles/assignAutoRoleDuringConfirmation';
import assignRoleToUser from '@root/app/server/lib/roles/assignRoleToUser';

const prisma = new PrismaClient();

// Mock the prisma client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        user: {
            count: jest.fn(),
        },
        role: {
            findMany: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

jest.mock('@root/app/server/lib/roles/assignRoleToUser', () => jest.fn());

describe('assignAutoRoleDuringConfirmation', () => {

    it('should assign the correct auto role based on user count', async () => {
        const mockUserCount = prisma.user.count as jest.Mock;
        const mockRoleFindMany = prisma.role.findMany as jest.Mock;
        const mockAssignRoleToUser = assignRoleToUser as jest.Mock;

        mockUserCount.mockResolvedValue(5);
        mockRoleFindMany.mockResolvedValue([
            { id: 'role1', order: 1 },
            { id: 'role2', order: 2 },
            { id: 'role3', order: 5 },
        ]);

        await assignAutoRoleDuringConfirmation('user1');

        expect(mockUserCount).toHaveBeenCalled();
        expect(mockRoleFindMany).toHaveBeenCalledWith({
            where: {
                order: {
                    not: null,
                },
            },
        });

        expect(mockAssignRoleToUser).toHaveBeenCalledWith({
            userId: 'user1',
            roleId: 'role3',
        });
    });

    it('should assign the role with the highest order if no matching order is found', async () => {
        const mockUserCount = prisma.user.count as jest.Mock;
        const mockRoleFindMany = prisma.role.findMany as jest.Mock;
        const mockAssignRoleToUser = assignRoleToUser as jest.Mock;

        mockUserCount.mockResolvedValue(10);
        mockRoleFindMany.mockResolvedValue([
            { id: 'role1', order: 1 },
            { id: 'role2', order: 2 },
            { id: 'role3', order: 5 },
        ]);

        await assignAutoRoleDuringConfirmation('user1');

        expect(mockUserCount).toHaveBeenCalled();
        expect(mockRoleFindMany).toHaveBeenCalledWith({
            where: {
                order: {
                    not: null,
                },
            },
        });

        expect(mockAssignRoleToUser).toHaveBeenCalledWith({
            userId: 'user1',
            roleId: 'role3',
        });
    });

    it('should handle cases with no roles available', async () => {
        const mockUserCount = prisma.user.count as jest.Mock;
        const mockRoleFindMany = prisma.role.findMany as jest.Mock;
        const mockAssignRoleToUser = assignRoleToUser as jest.Mock;

        mockUserCount.mockResolvedValue(1);
        mockRoleFindMany.mockResolvedValue([]);

        await assignAutoRoleDuringConfirmation('user1');

        expect(mockUserCount).toHaveBeenCalled();
        expect(mockRoleFindMany).toHaveBeenCalledWith({
            where: {
                order: {
                    not: null,
                },
            },
        });

        expect(mockAssignRoleToUser).toHaveBeenCalledWith({
            userId: 'user1',
            roleId: undefined,
        });
    });
});