import { type RoleType } from '@prisma/client'

const getUsersDBQuery = ({
    searchValue,
    role
}: {
    searchValue?: string,
    role?: RoleType | 'all'
}) => {

    let query = { where: {} }

    if (searchValue) {
        query = {
            where: {
                OR: [
                    {
                        email: {
                            contains: searchValue,
                            mode: 'insensitive',
                        },
                    },
                    {
                        name: {
                            contains: searchValue,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
        }
    }

    if (role !== 'all' && role) {
        query = {
            where: {
                ...query.where,
                roleId: role
            }
        }
    }
    return query;


}

export default getUsersDBQuery;