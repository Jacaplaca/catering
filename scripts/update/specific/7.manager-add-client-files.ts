import { add } from '@root/app/server/lib/dashboardItems';

const managerDashboardItemsClientFiles = async () => {
    console.log("7 >>> Add client-files to manager...");
    return add(["client-files"], "manager");
}

export default managerDashboardItemsClientFiles;