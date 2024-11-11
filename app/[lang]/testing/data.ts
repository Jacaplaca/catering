import { faker } from '@faker-js/faker/locale/pl';

const generateDummyDB = (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
        value: `${faker.person.firstName()} ${faker.person.lastName()}`,
        id: faker.string.alphanumeric(5),
        age: faker.number.int({ min: 18, max: 80 }),
        sex: faker.person.sex(),
        i: index + 1
    }));
};

const dummyDB = generateDummyDB(10000);

export default dummyDB;

