import { RoleType } from '@prisma/client';
import { createCateringNotSettingsProcedure } from '@root/app/server/api/specific/trpc';
import { getSetting } from '@root/app/server/cache/settings';
import { s3deleteKeys } from '@root/app/server/s3/delete';
import { logoUploadValid } from '@root/app/validators/specific/media';
import { type z } from 'zod';

const logoUpload = createCateringNotSettingsProcedure([RoleType.manager])
    .input(logoUploadValid)
    .mutation(async ({ ctx, input }) => {
        const { session, db } = ctx;
        const { catering } = session;
        const { key, mode } = input;
        const logoPrefix = await getSetting<string>('s3-prefix', 'logo');
        const logoWholeKey = `${logoPrefix}/${key}`;
        const getSettingsKey = (mode: z.infer<typeof logoUploadValid>['mode']) => {
            switch (mode) {
                case 'light':
                    return 'logoLight';
                case 'dark':
                    return 'logoDark';
                default:
                    return 'logoLight';
            }
        }

        const currentLogos = await db.catering.findUnique({
            where: { id: catering.id },
            select: {
                settings: {
                    select: {
                        logoLight: true,
                        logoDark: true,
                    },
                },
            },
        });

        if (currentLogos) {
            const currentLogo = currentLogos.settings[getSettingsKey(mode)]
            if (currentLogo) {
                await s3deleteKeys([currentLogo])
            }
        }

        return db.catering.update({
            where: { id: catering.id },
            data: {
                settings: {
                    set: {
                        [getSettingsKey(mode)]: logoWholeKey,
                    },
                },
            },
        });
    });

const mediaRouter = {
    logoUpload,
};

export default mediaRouter;