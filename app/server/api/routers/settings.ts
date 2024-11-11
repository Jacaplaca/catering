import {
    protectedProcedure,
    publicProcedure,
    superAdminProcedure,
} from "server/api/trpc";
import { getSetting, getSettingsGroup, updateSetting } from '@root/app/server/cache/settings';
import { getSettingsGroupValidator, getTableColumnsValid, updateEmailSettingsValid, updateTableColumnsValid } from '@root/app/validators/settings';
import updateClipboard from '@root/app/server/lib/clipboard';
import { settingColumnsRole } from '@root/app/assets/maps/catering';
import { type TableType } from '@root/types/specific';
import { type RoleType } from '@prisma/client';
import sendMail from '@root/app/server/email/libs/sendEmail';

const getColumnsForRole = async ({ key, roleId }: {
    key: TableType;
    roleId: RoleType;
}) => {
    const tableColumnsSettingKey = settingColumnsRole[key][roleId];
    if (!tableColumnsSettingKey) { return null }
    return getSetting<string[]>("table-columns", tableColumnsSettingKey);
}

export const settingsRouter = {

    getSettingsGroups: publicProcedure
        .input(getSettingsGroupValidator)
        .query(async ({ input }) => {
            const { group } = input;
            return await getSettingsGroup(group);
        }),

    getTableColumns: protectedProcedure
        .input(getTableColumnsValid)
        .query(async ({ ctx: { session: { user } }, input: { key } }) => {
            return getColumnsForRole({ key, roleId: user.roleId });
        }),

    updateTableColumns: protectedProcedure
        .input(updateTableColumnsValid)
        .mutation(async ({ ctx: { session: { user } }, input: { key, columns } }) => {
            const columnsAllowed = await getColumnsForRole({ key, roleId: user.roleId });
            const columnsFiltered = columnsAllowed ? columns.filter((column) => columnsAllowed.includes(column)) : columns;
            return updateClipboard({ key, value: columnsFiltered, userId: user.id });
        }),

    getSuperAdminSettings: superAdminProcedure
        .query(async () => {
            return getSettingsGroup('email', true) as Promise<{
                contactAdmin: string;
                from: string;
                fromAlias: string;
                fromActivation: string;
                host: string;
                password: string;
                port: number;
                templateHtmlWrapper: string;
                username: string;
            }>
        }),

    testEmail: superAdminProcedure
        .input(updateEmailSettingsValid)
        .mutation(async ({ ctx: { session: { user } }, input }) => {
            const { contactAdmin, from, fromAlias, host, password, port, templateHtmlWrapper, username, lang } = input;
            const customSettings = {
                options: {
                    host,
                    port,
                    auth: {
                        user: username,
                        pass: password,
                    },
                },
                templateWrapper: templateHtmlWrapper,
                fromAlias,
                contactAdmin,
                lang,
                from,
            };
            return sendMail({
                to: user.email, dynamicContext: {
                    url: 'https://www.google.com',
                }, templateName: 'test', lang, customSettings
            });
        }),

    updateEmailSettings: superAdminProcedure
        .input(updateEmailSettingsValid)
        .mutation(async ({ input }) => {
            const { contactAdmin, from, fromAlias, host, password, port, templateHtmlWrapper, username, fromActivation } = input;
            await updateSetting({ group: 'email', name: 'contactAdmin', value: contactAdmin, refreshCache: false });
            await updateSetting({ group: 'email', name: 'from', value: from, refreshCache: false });
            await updateSetting({ group: 'email', name: 'fromAlias', value: fromAlias, refreshCache: false });
            await updateSetting({ group: 'email', name: 'host', value: host, refreshCache: false });
            await updateSetting({ group: 'email', name: 'password', value: password, refreshCache: false });
            await updateSetting({ group: 'email', name: 'port', value: port, refreshCache: false });
            await updateSetting({ group: 'email', name: 'templateHtmlWrapper', value: templateHtmlWrapper, refreshCache: false });
            await updateSetting({ group: 'email', name: 'fromActivation', value: fromActivation, refreshCache: false });
            await updateSetting({ group: 'email', name: 'username', value: username, refreshCache: true });
            return { success: true };
        }),

    activateApp: superAdminProcedure
        .mutation(async () => {
            return updateSetting({ group: 'app', name: 'active', value: true });
        }),

    deactivateApp: superAdminProcedure
        .mutation(async () => {
            return updateSetting({ group: 'app', name: 'active', value: false });
        }),

    getIsAppActive: publicProcedure
        .query(async () => {
            return getSetting<boolean>('app', 'active');
        }),
}


