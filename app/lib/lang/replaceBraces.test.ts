import replaceBraces from '@root/app/lib/lang/replaceBraces';

describe('replaceBraces', () => {
    it('should replace single pair of braces with corresponding value from replacements', () => {
        const str = 'Hello, {}!';
        const replacements = ['world'];
        const expected = 'Hello, world!';
        expect(replaceBraces(str, replacements)).toBe(expected);
    });

    it('should replace multiple pairs of braces with corresponding values from replacements', () => {
        const str = 'Hello, {} and {}!';
        const replacements = ['Alice', 'Bob'];
        const expected = 'Hello, Alice and Bob!';
        expect(replaceBraces(str, replacements)).toBe(expected);
    });

    it('should leave braces empty if there are not enough replacements', () => {
        const str = 'Hello, {} and {}!';
        const replacements = ['Alice'];
        const expected = 'Hello, Alice and !';
        expect(replaceBraces(str, replacements)).toBe(expected);
    });

    it('should leave the string unchanged if there are no braces', () => {
        const str = 'Hello, world!';
        const replacements: string[] = [];
        expect(replaceBraces(str, replacements)).toBe(str);
    });

    it('should handle an empty string input', () => {
        const str = '';
        const replacements: string[] = [];
        expect(replaceBraces(str, replacements)).toBe(str);
    });

    it('should handle empty replacements array', () => {
        const str = 'Hello, {}!';
        const replacements: string[] = [];
        const expected = 'Hello, !';
        expect(replaceBraces(str, replacements)).toBe(expected);
    });

    it('should replace braces correctly with extra replacements provided', () => {
        const str = 'Hello, {}!';
        const replacements = ['world', 'extra'];
        const expected = 'Hello, world!';
        expect(replaceBraces(str, replacements)).toBe(expected);
    });
});
