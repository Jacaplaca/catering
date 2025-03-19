import { db } from '@root/app/server/db';

const addOrdersToDietician = async () => {
    console.log("19 >>> addOrdersToDietician...");
    return await db.role.update({
        where: { id: "dietician" },
        data: {
            dashboardItems: {
                push: "orders"
            }
        }
    });
}

export default addOrdersToDietician;