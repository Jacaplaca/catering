import { randomUUID } from 'crypto';

const tokenGenerator = (validitySeconds: number) => {
    const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
    const tokenValidFor = (validitySeconds * 1000) || 3600000;
    const expires = new Date(Date.now() + tokenValidFor);
    return { token, expires };
}

export default tokenGenerator;