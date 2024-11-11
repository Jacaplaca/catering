const formatFileSize = (bytes: number): string => {
    const formatNumber = (num: number) => Number.isInteger(num) ? num.toString() : num.toFixed(2);

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${formatNumber(bytes / 1024)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${formatNumber(bytes / (1024 * 1024))} MB`;
    return `${formatNumber(bytes / (1024 * 1024 * 1024))} GB`;
};

export default formatFileSize;
