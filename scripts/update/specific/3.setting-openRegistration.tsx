import { updateSetting } from '@root/app/server/cache/settings';
import { db } from '@root/app/server/db';

const settingOpenRegistration = async () => {
    console.log("3 >>> settingOpenRegistration...");
    const managerRole = await db.role.findUnique({
        where: {
            id: "manager"
        }
    })

    if (managerRole?.closeRegistration) {
        const firstManager = await db.manager.findFirst({});
        if (firstManager) {
            return await updateSetting({ group: 'main', name: 'openRegistration', value: false });
        }
    }
}

export default settingOpenRegistration;