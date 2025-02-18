const returnPdfForFront = async ({ pdfPromise, fileName }: { pdfPromise: Promise<Buffer<ArrayBufferLike>>, fileName: string }) => {
    const pdfBuffer = await pdfPromise;
    const base64Pdf = pdfBuffer.toString('base64');

    return {
        base64Pdf,
        contentType: 'application/pdf',
        fileName
    };
}

export default returnPdfForFront;
