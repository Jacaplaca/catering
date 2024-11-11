import { db } from '@root/app/server/db';

const managerDashboardItemsConsumers = async () => {
    console.log("4 >>> managerDashboardItemsConsumers...");
    return await db.role.update({
        where: { id: "manager" },
        data: {
            dashboardItems: {
                push: "consumers"
            }
        }
    });
}

export default managerDashboardItemsConsumers;