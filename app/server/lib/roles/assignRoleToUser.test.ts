/* eslint-disable @typescript-eslint/unbound-method */
// assignRoleToUser.test.ts

import { PrismaClient } from '@prisma/client';
import assignRoleToUser from '@root/app/server/lib/roles/assignRoleToUser';

// Create a new instance of PrismaClient for each test
const prisma = new PrismaClient();

// Mock the prisma client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        user: {
            update: jest.fn(),
            count: jest.fn(),
        }
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

describe('assignRoleToUser', () => {
    it('should assign a role to the user', async () => {
        const mockUserUpdate = prisma.user.update as jest.Mock;

        // Mock the response for updating the user
        mockUserUpdate.mockResolvedValue({
            id: 'user1',
            role: {
                id: 'role1',
            },
            inviter: {
                id: 'inviter1',
            },
        });

        // Call the function with appropriate parameters
        const result = await assignRoleToUser({
            userId: 'user1',
            roleId: 'role1',
            inviterId: 'inviter1',
        });

        // Expectations
        expect(mockUserUpdate).toHaveBeenCalledWith({
            where: { id: 'user1' },
            data: {
                role: {
                    connect: {
                        id: 'role1',
                    },
                },
                inviter: {
                    connect: {
                        id: 'inviter1',
                    },
                },
            },
        });

        expect(result).toEqual({
            id: 'user1',
            role: {
                id: 'role1',
            },
            inviter: {
                id: 'inviter1',
            },
        });
    });

    it('should not assign a role if roleId is not provided', async () => {
        const mockUserUpdate = prisma.user.update as jest.Mock;

        // Call the function without roleId
        const result = await assignRoleToUser({
            userId: 'user1',
            roleId: undefined,
            inviterId: 'inviter1',
        });

        // Expect no update to be called
        expect(mockUserUpdate).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });
});
