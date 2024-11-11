import gate from '@root/scripts/gate';
import populate from '@root/scripts/populate';

const main = async () => {
    await gate(populate, "Db will be clean, do you want to continue? (Y/N) ")
}

void main();