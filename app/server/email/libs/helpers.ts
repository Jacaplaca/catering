/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
export const text = ({ url, subject }: { url: string, subject: string }) => {
    return `${subject}\n${url}\n\n`
}


