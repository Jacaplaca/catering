import { PrismaClient, type RoleType } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pl';
import { hash } from 'bcryptjs';
import { subDays } from 'date-fns';

import init from '../init';
import dropDb from '@root/scripts/dropDb';
import { updateSetting } from '@root/app/server/cache/settings';
import getCurrentTime from '@root/app/lib/date/getCurrentTime';

const superAdminEmail = 'superadmin@example.com';
const managerEmail = 'manager@example.com';
const clientEmail = 'client@example.com';
const dieticianEmail = 'dietician@example.com';
const kitchenEmail = 'kitchen@example.com';

//on clean database before seed run you should start app to populate database;
const prisma = new PrismaClient();

const NUM_SUPERADMIN = 1;
const NUM_CATERINGS = 1;
const NUM_MANAGERS = 1;
const NUM_CLIENTS = 1;
const NUM_DIETICIANS = 2;
const NUM_KITCHEN = 3;
const NUM_CONSUMERS = 30;
const TAGS = 0;
const CREATE_ORDERS = true;

const fakePassword = 'aaa';

const makeCode = (name: string) => {
    let code = name.trim().replace(/[^a-zA-Z]/g, '').slice(0, 5).toUpperCase();
    while (code.length < 5) {
        code += faker.string.alpha(1).toUpperCase();
    }
    return code;
}

async function main() {
    await dropDb();
    await init();

    const passwordHash = await hash(fakePassword, 12);

    // Create SuperAdmin
    for (let i = 0; i < NUM_SUPERADMIN; i++) {
        await prisma.user.create({
            data: {
                email: superAdminEmail,
                name: "Super Admin",
                passwordHash,
                role: { connect: { id: 'superAdmin' } },
                emailVerified: getCurrentTime(),
                superAdmin: {
                    create: {}
                }
            }
        });
        // console.log('SuperAdmin created:', user);
    }

    const getUserData = (role: RoleType, email?: string, name?: string) => {

        return {
            name: name ? name : faker.person.fullName(),
            email: email ? email : faker.internet.email(),
            passwordHash,
            role: { connect: { id: role } },
            emailVerified: getCurrentTime()
        }
    }


    const getClientsData = (currentCodes: string[]) => {
        const usedCodes = new Set(currentCodes);

        return Array.from({ length: NUM_CLIENTS }).map((_, i) => {
            const name = faker.company.name();
            let code = makeCode(name);

            let suffix = 1;
            while (usedCodes.has(code)) {
                code = `${code.slice(0, 5)}${suffix}`;
                suffix++;
            }
            usedCodes.add(code);

            return {
                user: {
                    create: getUserData('client', i === 0 ? clientEmail : undefined, i === 0 ? "Client Eastwood" : undefined)
                },
                settings: {},
                name: name,
                info: {
                    name: name,
                    email: faker.datatype.boolean(0.5) ? faker.internet.email() : '',
                    phone: faker.datatype.boolean(0.45) ? faker.phone.number() : '',
                    address: faker.datatype.boolean(0.6) ? faker.location.streetAddress() : '',
                    city: faker.datatype.boolean(0.8) ? faker.location.city() : '',
                    zip: faker.datatype.boolean(0.7) ? faker.location.zipCode() : '',
                    contactPerson: faker.datatype.boolean(0.4) ? faker.person.fullName() : '',
                    notes: faker.datatype.boolean(0.1) ? faker.lorem.sentence() : '',
                    country: faker.datatype.boolean(0.2) ? faker.location.country() : '',
                    code,
                },
            };
        });
    }


    // const currentCodes = currentClients.map(client => client.code);

    // Create Catering and related entities
    for (let i = 0; i < NUM_CATERINGS; i++) {
        const catering = await prisma.catering.create({
            data: {
                name: faker.company.name(),
                settings: {
                    firstOrderDeadline: '20:00',
                    secondOrderDeadline: '14:00',
                    timeZone: 'Europe/Warsaw',
                    phone: faker.phone.number(),
                    email: faker.internet.email(),
                },
                managers: {
                    create: Array.from({ length: NUM_MANAGERS }).map((_, i) => ({
                        user: {
                            create: getUserData('manager',
                                i === 0
                                    ? managerEmail
                                    : undefined,
                                i === 0
                                    ? "Catering Manager"
                                    : undefined)
                        }
                    }))
                },
                clients: {
                    create: getClientsData([])
                },
                dieticians: {
                    create: Array.from({ length: NUM_DIETICIANS }).map((_, i) => ({
                        name: faker.company.name(),
                        user: {
                            create: getUserData('dietician',
                                i === 0
                                    ? dieticianEmail
                                    : undefined,
                                i === 0
                                    ? "Dietician"
                                    : undefined)
                        },
                    }))
                },
                kitchens: {
                    create: Array.from({ length: NUM_KITCHEN }).map((_, i) => ({
                        name: faker.company.name(),
                        user: {
                            create: getUserData('kitchen',
                                i === 0
                                    ? kitchenEmail
                                    : undefined,
                                i === 0
                                    ? "Kitchen"
                                    : undefined)
                        },
                    }))
                },
                tags: {
                    create: Array.from({ length: TAGS }).map(() => ({
                        name: faker.lorem.word(),
                        type: 'client'
                    })
                    )
                }
            }
        });

        const { id: cateringId } = catering;
        const managersUsersId = (await prisma.manager.findMany({
            where: {
                cateringId
            }
        })).map(manager => manager.userId).filter(Boolean);

        const clientsUsersId = (await prisma.client.findMany({
            where: {
                cateringId
            }
        })).map(client => client.userId).filter(Boolean);

        const dieticians = (await prisma.dietician.findMany({
            where: {
                cateringId
            }
        }));

        const dieticiansUsersId = dieticians.map(dietician => dietician.userId)
            .filter(Boolean);

        const kitchensUsersId = (await prisma.kitchen.findMany({
            where: {
                cateringId
            }
        })).map(kitchen => kitchen.userId);

        const userIds = [...managersUsersId, ...clientsUsersId, ...dieticiansUsersId, ...kitchensUsersId].filter(Boolean);

        await prisma.user.updateMany({
            where: {
                id: {
                    in: userIds
                }
            },
            data: {
                cateringId
            }
        });

        const cateringClients = await prisma.client.findMany({
            where: {
                cateringId
            }
        });

        for (const client of cateringClients) {
            const { id: clientId } = client;

            const dieticianIds = dieticians.map(dietician => dietician.id);

            const getUniqueConsumerCode = async (name: string, cateringId: string) => {
                let code = makeCode(name);
                let suffix = 1;
                let isUnique = false;

                while (!isUnique) {
                    const existingConsumer = await prisma.consumer.findFirst({
                        where: {
                            cateringId,
                            code
                        }
                    });

                    if (!existingConsumer) {
                        isUnique = true;
                    } else {
                        code = `${name.slice(0, 5).toUpperCase()}${suffix}`;
                        suffix++;
                    }
                }

                return code;
            };

            for (let i = 0; i < NUM_CONSUMERS; i++) {
                // dietIterator++;
                // const diet = faker.datatype.boolean(0.5) ? await prisma.diet.create({
                //     data: {
                //         code: dietIterator,
                //         dieticianId: faker.helpers.arrayElement(dieticianIds),
                //         cateringId,
                //         notes: faker.lorem.sentence(),
                //         description: faker.lorem.sentence()
                //     }
                // }) : null;

                const consumerName = faker.person.fullName();
                const consumerCode = await getUniqueConsumerCode(consumerName, cateringId);

                const diet = {
                    code: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
                        faker.string.alpha({ length: faker.number.int({ min: 4, max: 10 }), casing: 'upper' })
                    ).join(' '),
                    description: faker.lorem.sentence()
                }

                await prisma.consumer.create({
                    data: {
                        clientId,
                        cateringId,
                        dieticianId: faker.helpers.arrayElement(dieticianIds),
                        name: consumerName,
                        notes: faker.lorem.sentence(),
                        code: consumerCode,
                        diet: faker.datatype.boolean(0.7) ? diet : null
                    }
                });

                // const { id: consumerId } = consumer;
                // await prisma.consumer.update({
                //     where: {
                //         id: consumerId
                //     },
                //     data: {
                //         dietId: diet?.id
                //     }
                // });
            }

            const consumersWithDiets = await prisma.consumer.findMany({
                where: {
                    cateringId,
                    clientId,
                    diet: {
                        isNot: null
                    }
                }
            });

            function generateDateRange(): { year: number, month: number, day: number }[] {
                const dates: { year: number, month: number, day: number }[] = [];
                const today = getCurrentTime();
                today.setHours(0, 0, 0, 0);
                const past = new Date(today);
                past.setMonth(today.getMonth() - 30);
                const future = new Date(today);
                future.setDate(today.getDate() + 2);


                for (let date = new Date(past); date <= future; date.setDate(date.getDate() + 1)) {
                    if (date.getDay() !== 0 && date.getDay() !== 6) {
                        dates.push({
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            day: date.getDate()
                        });
                    }
                }

                return dates;

            }

            const dateRange = CREATE_ORDERS ? generateDateRange() : [];

            for (const deliveryDay of dateRange) {
                const deliveryDayDate = new Date(deliveryDay.year, deliveryDay.month, deliveryDay.day);
                const isInFuture = deliveryDayDate > getCurrentTime();
                const status = isInFuture
                    ? faker.helpers.arrayElement(['draft', 'in_progress'])
                    : faker.helpers.arrayElement(['draft', 'in_progress', 'completed']);

                const isNotDraft = status !== 'draft';

                const sentToCateringAt = isNotDraft
                    ? faker.date.between({
                        from: subDays(deliveryDayDate, 1),
                        to: deliveryDayDate
                    })
                    : undefined;

                const breakfastDiet = faker.helpers.arrayElements(consumersWithDiets.map(consumer => ({ consumerId: consumer.id })), { min: 1, max: consumersWithDiets.length });

                const lunchDietWas = faker.helpers.arrayElements(consumersWithDiets.map(consumer => ({ consumerId: consumer.id })), { min: 1, max: consumersWithDiets.length });
                const dinnerDietWas = faker.helpers.arrayElements(consumersWithDiets.map(consumer => ({ consumerId: consumer.id })), { min: 1, max: consumersWithDiets.length });

                const lunchDiet = faker.datatype.boolean(0.5) ? faker.helpers.arrayElements(
                    lunchDietWas,
                    { min: Math.ceil(lunchDietWas.length / 2), max: lunchDietWas.length }
                ) : lunchDietWas;

                const dinnerDiet = faker.datatype.boolean(0.5) ? faker.helpers.arrayElements(
                    dinnerDietWas,
                    { min: Math.ceil(dinnerDietWas.length / 2), max: dinnerDietWas.length }
                ) : dinnerDietWas;

                const lunchStandard = faker.number.int({ min: 13, max: 25 });
                const dinnerStandard = faker.number.int({ min: 13, max: 25 });
                const lunchStandardBeforeDeadline = faker.number.int({ min: 13, max: 25 });
                const dinnerStandardBeforeDeadline = faker.number.int({ min: 13, max: 25 });
                const orderToCreate = {
                    cateringId,
                    clientId,
                    deliveryDay,
                    status,
                    breakfastStandard: faker.number.int({ min: 13, max: 25 }),
                    lunchStandard,
                    dinnerStandard,
                    breakfastDiet: {
                        create: breakfastDiet
                    },
                    breakfastDietCount: breakfastDiet.length,
                    lunchDiet: {
                        create: lunchDiet
                    },
                    lunchDietCount: lunchDiet.length,
                    dinnerDiet: {
                        create: dinnerDiet
                    },
                    dinnerDietCount: dinnerDiet.length,
                    // before deadline start
                    lunchStandardBeforeDeadline,
                    dinnerStandardBeforeDeadline,
                    lunchDietBeforeDeadline: {
                        create: lunchDietWas
                    },
                    lunchDietCountBeforeDeadline: lunchDietWas.length,
                    dinnerDietBeforeDeadline: {
                        create: dinnerDietWas
                    },
                    dinnerDietCountBeforeDeadline: dinnerDietWas.length,
                    // before deadline end
                    sentToCateringAt,
                };
                await prisma.order.create({
                    data: orderToCreate
                });
            }


        }
    }

    const users = await prisma.user.findMany();
    for (const user of users) {
        const { id } = user;
        await prisma.account.create({
            data: {
                userId: id,
                provider: 'credentials',
                type: 'credentials',
                providerAccountId: id,
            }
        });
    }

    await updateSetting({ group: 'main', name: 'openRegistration', value: false });

    // for (let i = 0; i < TAGS; i++) {
    //     await prisma.tag.create({
    //         data: {
    //             name: faker.lorem.word(),
    //             type: 'client'
    //         }
    //     });
    // }
}

const populate = async () => {
    return main()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(() => {
            void prisma.$disconnect();
            process.exit(0);
        });
};

export default populate;