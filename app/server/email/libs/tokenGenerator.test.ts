import tokenGenerator from './tokenGenerator'; // adjust the import path as needed

describe('tokenGenerator', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('generates a token with 64 characters', () => {
        const { token } = tokenGenerator(3600);
        expect(token).toHaveLength(64);
    });

    test('generates a token consisting only of alphanumeric characters', () => {
        const { token } = tokenGenerator(3600);
        expect(token).toMatch(/^[a-zA-Z0-9]+$/);
    });

    test('sets the correct expiration date for the given validity time', () => {
        const validitySeconds = 3600;
        const now = new Date('2024-01-01T00:00:00Z');
        jest.setSystemTime(now);

        const { expires } = tokenGenerator(validitySeconds);

        const expectedExpires = new Date(now.getTime() + validitySeconds * 1000);
        expect(expires).toEqual(expectedExpires);
    });
    test('generates unique tokens on each call', () => {
        const { token: token1 } = tokenGenerator(3600);
        const { token: token2 } = tokenGenerator(3600);
        expect(token1).not.toEqual(token2);
    });
});