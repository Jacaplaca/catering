import { db } from '@root/app/server/db';

const addSettingsToKitchen = async () => {
    console.log("18 >>> addSettingsToKitchen...");
    await db.role.updateMany({
        where: {
            id: 'kitchen',
            NOT: {
                dashboardItems: {
                    has: 'settings'
                }
            }
        },
        data: {
            dashboardItems: {
                push: 'settings',
            }
        },
    });
}


export default addSettingsToKitchen;