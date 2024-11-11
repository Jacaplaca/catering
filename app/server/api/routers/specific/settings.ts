import checkIfHasFinishedSettings from '@root/app/server/api/routers/specific/libs/hasFinishedSettings';
import { createCateringNotSettingsProcedure } from '@root/app/server/api/specific/trpc';
import { createRoleProcedure, publicProcedure } from '@root/app/server/api/trpc';
import { getSettingsGroup } from '@root/app/server/cache/settings';
import { clientSettingsValidator, dieticianSettingsValidator, managerSettingsValidator } from '@root/app/validators/specific/settings';

const managerSettings = createCateringNotSettingsProcedure('manager')
    .query(({ ctx }) => {
        const { session } = ctx;
        const { catering } = session;
        return {
            ...catering.settings,
            name: catering.name ?? '',
        }
    });

const clientSettings = createCateringNotSettingsProcedure('client')
    .query(async ({ ctx }) => {
        const { session, db } = ctx;
        const { user } = session;
        const client = await db.client.findUnique({
            where: {
                userId: user.id,
            }
        });
        if (!client) {
            throw new Error('Client not found');
        }

        return {
            name: client.settings.name ?? client.name,
        }
    });

const dieticianSettings = createCateringNotSettingsProcedure('dietician')
    .query(async ({ ctx }) => {
        const { session, db } = ctx;
        const { user } = session;
        const dietician = await db.dietician.findUnique({
            where: {
                userId: user.id,
            }
        });
        if (!dietician) {
            throw new Error('Dietician not found');
        }
        return {
            name: dietician.name,
        }
    });

const updateManagerSettings = createCateringNotSettingsProcedure('manager')
    .input(managerSettingsValidator)
    .mutation(({ ctx, input }) => {
        const { session, db } = ctx;
        const { catering } = session;
        const { name, firstOrderDeadline, secondOrderDeadline, phone, email } = input;
        return db.catering.update({
            where: {
                id: catering.id
            },
            data: {
                name,
                settings: {
                    update: {
                        firstOrderDeadline,
                        secondOrderDeadline,
                        phone,
                        email,
                    }
                }
            }
        });
    });

const updateClientSettings = createCateringNotSettingsProcedure('client')
    .input(clientSettingsValidator)
    .mutation(({ ctx, input }) => {
        const { session, db } = ctx;
        const { user } = session;
        return db.client.update({
            where: {
                userId: user.id,
            },
            data: {
                name: input.name,
            }
        });
    });

const updateDieticianSettings = createCateringNotSettingsProcedure('dietician')
    .input(dieticianSettingsValidator)
    .mutation(({ ctx, input }) => {
        const { session, db } = ctx;
        const { user } = session;
        return db.dietician.update({
            where: {
                userId: user.id,
            },
            data: {
                name: input.name,
            }
        });
    });

const hasFinished = createRoleProcedure(['manager', 'client', 'superAdmin', 'dietician', 'kitchen'])
    .query(async ({ ctx }) => {
        const { session, db } = ctx;
        const { user } = session;
        const { roleId, cateringId } = user;
        if (roleId === 'superAdmin') {
            return checkIfHasFinishedSettings({
                roleId,
                userId: user.id,
                catering: null,
            });
        }

        const catering = await db.catering.findUnique({
            where: { id: cateringId },
        });

        if (!catering) {
            throw new Error('Catering not found');
        }
        return checkIfHasFinishedSettings({
            roleId,
            userId: user.id,
            catering,
        });
    });

type PersonalizationSettings = {
    siteName: string;
    logoDark: string;
    logoLight: string;
    firstOrderDeadline: string;
    secondOrderDeadline: string;
    timeZone: string;
}

const getCateringSettings = publicProcedure
    .query(async ({ ctx }) => {
        const { session, db } = ctx;
        const settings = await getSettingsGroup('main');
        if (!session || session?.user.roleId === 'superAdmin') {
            return settings as PersonalizationSettings;
        }
        const cateringId = session?.user.cateringId;
        if (!cateringId) {
            throw new Error('Catering not found');
        }
        const cateringSettings = await db.catering.findUnique({
            where: { id: cateringId },
            select: {
                settings: true,
            }
        });
        if (!cateringSettings) {
            throw new Error('Catering not found');
        }
        const cleanedSettings = Object.fromEntries(
            Object.entries(cateringSettings.settings)
                .filter(([, value]) => value)
        );
        return {
            ...settings,
            ...cleanedSettings
        } as unknown as PersonalizationSettings;
    });

const settingsRouter = {
    getForManager: managerSettings,
    getForClient: clientSettings,
    getForDietician: dieticianSettings,
    updateByManager: updateManagerSettings,
    updateByClient: updateClientSettings,
    updateByDietician: updateDieticianSettings,
    hasFinished,
    get: getCateringSettings,
};

export default settingsRouter;

