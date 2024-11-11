import translate from '@root/app/lib/lang/translate';
import replaceBraces from '@root/app/lib/lang/replaceBraces';

// Mocking the replaceBraces function
jest.mock('@root/app/lib/lang/replaceBraces', () => ({
    __esModule: true,
    default: jest.fn(),
}));


describe('translate', () => {
    beforeEach(() => {
        // Reset the mock before each test
        (replaceBraces as jest.Mock).mockReset();
    });

    it('should return an empty string if key is undefined', () => {
        const dictionary = { hello: 'Hello, {}!' };
        expect(translate(dictionary, undefined)).toBe('');
    });

    it('should return the translation from the dictionary', () => {
        const dictionary = { hello: 'Hello, {}!' };
        expect(translate(dictionary, 'hello')).toBe('Hello, {}!');
    });

    it('should return the key if it does not exist in the dictionary', () => {
        const dictionary = { hello: 'Hello, {}!' };
        expect(translate(dictionary, 'goodbye')).toBe('goodbye');
    });

    it('should replace braces with replacements if provided', () => {
        const dictionary = { hello: 'Hello, {}!' };
        const replacements = ['world'];
        (replaceBraces as jest.Mock).mockReturnValue('Hello, world!');

        const result = translate(dictionary, 'hello', replacements);

        expect(result).toBe('Hello, world!');
        expect(replaceBraces).toHaveBeenCalledWith('Hello, {}!', ['world']);
    });

    it('should handle multiple replacements', () => {
        const dictionary = { greet: 'Hello, {} and {}!' };
        const replacements = ['Alice', 'Bob'];
        (replaceBraces as jest.Mock).mockReturnValue('Hello, Alice and Bob!');

        const result = translate(dictionary, 'greet', replacements);

        expect(result).toBe('Hello, Alice and Bob!');
        expect(replaceBraces).toHaveBeenCalledWith('Hello, {} and {}!', ['Alice', 'Bob']);
    });

    it('should convert numeric replacements to strings', () => {
        const dictionary = { age: 'I am {} years old.' };
        const replacements = [30];
        (replaceBraces as jest.Mock).mockReturnValue('I am 30 years old.');

        const result = translate(dictionary, 'age', replacements);

        expect(result).toBe('I am 30 years old.');
        expect(replaceBraces).toHaveBeenCalledWith('I am {} years old.', ['30']);
    });

    it('should return the translation without calling replaceBraces if no replacements are provided', () => {
        const dictionary = { hello: 'Hello, {}!' };
        const expected = 'Hello, {}!';
        const result = translate(dictionary, 'hello');

        expect(result).toBe(expected);
        expect(replaceBraces).not.toHaveBeenCalled();
    });
});
