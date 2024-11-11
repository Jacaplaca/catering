import { replaceVariables } from '@root/app/server/lib/replaceVariables';
import { type ContentContextType } from '@root/types';

describe('replaceVariables', () => {
    it('should return content unchanged if context is not provided', () => {
        const content = 'This is a [[test]] content';
        expect(replaceVariables(content, undefined as unknown as ContentContextType)).toBe(content);
    });

    it('should replace double bracket variables with context values', () => {
        const content = 'This is a [[test]] content';
        const context = { test: 'successful' } as ContentContextType;
        const expected = 'This is a [successful] content';
        expect(replaceVariables(content, context)).toBe(expected);
    });

    it('should replace single bracket variables with context values', () => {
        const content = 'This is a [test] content';
        const context = { test: 'successful' } as ContentContextType;
        const expected = 'This is a successful content';
        expect(replaceVariables(content, context)).toBe(expected);
    });

    it('should not replace variables if context value is null or undefined', () => {
        const content = 'This is a [[test]] content';
        const context = { test: null } as unknown as ContentContextType;
        expect(replaceVariables(content, context)).toBe(content);
    });

    it('should return content unchanged if the context key does not exist', () => {
        const content = 'This is a [[missing]] content';
        const context = { test: 'successful' } as ContentContextType;
        expect(replaceVariables(content, context)).toBe(content);
    });

    it('should handle multiple variables in the content', () => {
        const content = 'Hello, [[name]]! You have [count] new messages.';
        const context = { name: 'Alice', count: 5 } as unknown as ContentContextType;
        const expected = 'Hello, [Alice]! You have 5 new messages.';
        expect(replaceVariables(content, context)).toBe(expected);
    });
});
