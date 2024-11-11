const placeholderData = <SomeType>(length: number, columns: { key: string }[]): SomeType[] => {
    return Array.from({ length }, () => {
        return columns.reduce((acc, el) => {
            // @ts-expect-error used only for placeholder data which is typed later on dynamically
            acc[el.key] = null;
            return acc;
        }, {} as SomeType);
    });
}

export default placeholderData;