import { type RoleType } from '@prisma/client';
import useParam from '@root/app/hooks/useParam';
import translate from '@root/app/lib/lang/translate';
import { api } from '@root/app/trpc/react';
import { useState } from 'react';

const useRoleFilter = ({
    lang,
    pageName,
    dictionary,
}: {
    lang: LocaleApp,
    pageName: string,
    dictionary: Record<string, string>
}) => {
    const setParam = useParam({ lang, pageName });

    const [role, setRole] = useState<'all' | RoleType>('all');
    const { data: roles = [] } = api.role.getAllowedRoles.useQuery();

    const filterByRole = (role: 'all' | RoleType) => {
        setRole(role);
        setParam({ param: ['page', 1], slugs: [], withDomain: true });
    };

    const roleFilter = ['all', ...roles?.map(r => r?.id)].map(role => ({
        label: translate(dictionary, `role:${role}`),
        id: role,
        filter: (id: string) => filterByRole(id as 'all' | RoleType)
    }));

    return {
        data: role,
        filter: roleFilter
    };

}

export default useRoleFilter;