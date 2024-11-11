const replaceBraces = (str: string, replacements: string[]): string => {
    let i = 0;
    return str.replace(/{}/g, () => {
        return replacements[i++] ?? '';
    })
}

export default replaceBraces;