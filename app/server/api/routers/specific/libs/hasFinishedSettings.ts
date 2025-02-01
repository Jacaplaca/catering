import { type Catering, type RoleType } from '@prisma/client';
import { db } from '@root/app/server/db';

const hasFinishedSettings = async ({
    roleId,
    userId,
    catering
}: {
    roleId?: RoleType
    userId: string
    catering: Catering | null
}) => {
    switch (roleId) {
        case 'manager':
            return Boolean(catering?.name
                && catering?.settings.firstOrderDeadline
                && catering?.settings.secondOrderDeadline
                && catering?.settings.timeZone
                && catering?.settings.phone
                && catering?.settings.email);
        case 'client':
            const clients = await db.client.findMany({
                where: {
                    userId: userId,
                }
            });
            return Boolean(clients.every(client => client.name));
        case 'dietician':
            const dietician = await db.dietician.findUnique({
                where: {
                    userId: userId,
                }
            });
            return Boolean(dietician?.name);
        default:
            return true;
    }
};

export default hasFinishedSettings;