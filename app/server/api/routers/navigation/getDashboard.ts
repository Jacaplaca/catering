import translate from '@root/app/lib/lang/translate';
import { protectedProcedure } from '@root/app/server/api/trpc';
import { getSetting } from '@root/app/server/cache/settings';
import { getDict } from '@root/app/server/cache/translations';
import { db } from '@root/app/server/db';
import { mainMenuValidator } from '@root/app/validators/user';
import { type DashboardMenuElement } from '@root/types';

const getDashboard = protectedProcedure
    .input(mainMenuValidator)
    .query(async ({ ctx, input }) => {
        const { lang } = input;
        const { user } = ctx.session;

        const dictionary = await getDict({ lang, key: 'dashboard' });

        const dashboard = await getSetting<DashboardMenuElement[]>('navigation', 'dashboard');

        const role = await db.role.findUnique({
            where: {
                id: user.roleId,
            }
        });

        if (!role) {
            return [];
        }

        const allowedGroups = role?.dashboardGroups;
        const allowedItems = role?.dashboardItems;

        const prepareItems = (items: DashboardMenuElement['items']) => {
            return items.map((item) => ({
                ...item,
                label: translate(dictionary, `dashboard:item-${item.key}-label`) ?? item.label,
            })).sort((a, b) => a.order - b.order);
        };

        const dashboardAllowed = [] as DashboardMenuElement[];
        dashboard.forEach((group) => {
            const { key, items, label } = group;
            if (key && allowedGroups.includes(key)) {
                dashboardAllowed.push({
                    ...group, label:
                        translate(dictionary, `dashboard:group-${key}-label`) ?? label,
                    items: prepareItems(items),
                });
            } else if (!key) {
                const filteredItems = prepareItems(items
                    .filter((item) => allowedItems.includes(item.key)));

                filteredItems.length && dashboardAllowed.push({ ...group, items: filteredItems });
            }
        });
        dashboardAllowed.sort((a, b) => a.order - b.order);

        return dashboardAllowed
    });

export default getDashboard;