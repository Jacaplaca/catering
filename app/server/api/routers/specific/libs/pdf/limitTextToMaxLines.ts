function customSplitTextToSize(
    doc: PDFKit.PDFDocument,
    text: string,
    availableWidth: number
): string[] {
    const lines: string[] = [];
    // Split text into paragraphs by newline
    const paragraphs = text.split('\n');
    paragraphs.forEach((paragraph) => {
        // Break paragraph into words
        const words = paragraph.split(' ');
        let currentLine = '';
        for (const word of words) {
            // Test concatenated line with the current word
            const testLine = currentLine ? currentLine + ' ' + word : word;
            if (doc.widthOfString(testLine) <= availableWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                }
                // If the word itself exceeds the available width, break it char by char
                if (doc.widthOfString(word) > availableWidth) {
                    let subWord = '';
                    for (const char of word) {
                        const testSubWord = subWord + char;
                        if (doc.widthOfString(testSubWord) <= availableWidth) {
                            subWord = testSubWord;
                        } else {
                            if (subWord) {
                                lines.push(subWord);
                            }
                            subWord = char;
                        }
                    }
                    currentLine = subWord;
                } else {
                    currentLine = word;
                }
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
    });
    return lines;
}

function limitTextToMaxLines(
    doc: PDFKit.PDFDocument,
    text: string,
    maxLines: number,
    availableWidth: number
): string {
    // Use customSplitTextToSize instead of doc.splitTextToSize
    const lines = customSplitTextToSize(doc, text, availableWidth);
    if (lines.length <= maxLines) {
        return lines.join('\n');
    }
    // Limit lines to maxLines and add ellipsis to the last line if needed
    const limitedLines = lines.slice(0, maxLines);
    let lastLine = limitedLines[limitedLines.length - 1];
    const ellipsis = '...';
    const ellipsisWidth = doc.widthOfString(ellipsis);
    while (lastLine && doc.widthOfString(lastLine) + ellipsisWidth > availableWidth) {
        lastLine = lastLine.slice(0, -1);
    }
    limitedLines[limitedLines.length - 1] = lastLine + ellipsis;
    return limitedLines.join('\n');
}

export default limitTextToMaxLines;
