function removePolishDiacritics(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function shortenString(str: string, maxLength = 255): string {
    return str.length >= maxLength ? str.slice(0, maxLength) : str;
}

function removeChars(label: string): string {
    return label.replace(/[\/\\?%*:|"<>[\]{}()';~!$&+`^=.,@#\s]/g, '');
}

function encodeRFC5987ValueChars(str: string): string {
    return encodeURIComponent(str)
        .replace(/%(7C|60|5E)/g, (match: string, p1: string) =>
            String.fromCharCode(parseInt(p1, 16))
        );
}

function safeFileName(str: string, maxLength = 255): string {
    return shortenString(encodeRFC5987ValueChars(removeChars(removePolishDiacritics(str))), maxLength);
}

export default safeFileName;
