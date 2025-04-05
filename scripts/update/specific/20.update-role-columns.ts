import { resetToDefault } from '@root/app/server/cache/settings';


const updateRoleColumns = async () => {
    console.log("20 >>> update role columns...");
    await resetToDefault('table-columns', 'order-for-kitchen');
    await resetToDefault('table-columns', 'order-for-manager');
    return;
}

export default updateRoleColumns;