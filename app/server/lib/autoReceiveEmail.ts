/* eslint-disable */
import cron from 'node-cron';
import { db } from '@root/app/server/db';
import getCurrentTime from '@root/app/lib/date/getCurrentTime';
import { env } from '@root/app/env';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { promises as fs } from 'fs';
import path from 'path';

const { EMAIL_RECEIVER, EMAIL_RECEIVER_PASSWORD, EMAIL_RECEIVER_HOST, EMAIL_RECEIVER_PORT } = env;

// Dodajemy zmienną kontrolującą pobieranie przeczytanych wiadomości
const checkSeen = true; // Ustaw na true, aby pobierać również przeczytane wiadomości

// Lista zaufanych adresów email, z których chcemy przetwarzać wiadomości
// Możesz dodać tutaj dowolną liczbę adresów email
const whiteEmails = [
    'dziewanowski@gmail.com',
];

// Lista dozwolonych tematów wiadomości
const whiteSubjects = [
    'Zamówienie posiłków',
    'Potwierdzenie zamówienia',
    'Dostawa posiłków',
    'Faktura za zamówienie'
];

// Funkcja pomocnicza do sprawdzania, czy adres email jest na białej liście
function isEmailWhitelisted(emailAddress: string): boolean {
    if (!emailAddress) return false;

    // Normalizuj adres email (konwersja na małe litery)
    const normalizedEmail = emailAddress.toLowerCase().trim();

    // Sprawdź dokładne dopasowanie adresu email
    if (whiteEmails.some(email => email.toLowerCase() === normalizedEmail)) {
        return true;
    }

    // Sprawdź dopasowanie domeny (adresy zaczynające się od @)
    const domainMatches = whiteEmails
        .filter(email => email.startsWith('@'))
        .some(domain => normalizedEmail.endsWith(domain.toLowerCase()));

    return domainMatches;
}

// Funkcja pomocnicza do sprawdzania, czy temat pasuje do dozwolonych tematów
function isSubjectWhitelisted(subject: string | undefined): boolean {
    if (!subject) return false;

    // Normalizuj temat (konwersja na małe litery)
    const normalizedSubject = subject.toLowerCase().trim();

    // Sprawdź czy temat zawiera którykolwiek z dozwolonych ciągów znaków
    return whiteSubjects.map(allowedSubject => allowedSubject.toLowerCase()).some(allowedSubject =>
        normalizedSubject.includes(allowedSubject.toLowerCase())
    );
}

// Funkcja do wydobywania daty z tematu emaila
function extractDateFromSubject(subject: string | undefined): { year: number, month: number, day: number } | null {
    if (!subject) return null;

    // Szukanie wzorca daty w formacie YYYY-MM-DD
    const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
    const match = subject.match(dateRegex);

    if (!match) return null;
    if (!match[1] || !match[2] || !match[3]) return null;

    // Konwersja na liczby i miesiąc zindeksowany od 0 (odejmujemy 1 od miesiąca)
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 0-indexed month
    const day = parseInt(match[3], 10);

    // Walidacja daty
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    if (month < 0 || month > 11) return null;
    if (day < 1 || day > 31) return null;

    return { year, month, day };
}

// Poprawiona konfiguracja IMAP
const imapConfig = {
    user: EMAIL_RECEIVER, // dummy@dziewanowski.pl
    password: EMAIL_RECEIVER_PASSWORD, // dummypass
    host: EMAIL_RECEIVER_HOST, // host367773.hostido.net.pl
    port: 993, // Standardowy port IMAP SSL
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false
    },
    authTimeout: 30000, // Zwiększony timeout uwierzytelniania do 30 sekund
    // debug: (info: string) => console.log('IMAP Debug:', info)
};

// console.log('imapConfig', imapConfig);

async function autoReceiveEmail() {
    console.log('Checking emails at', getCurrentTime());

    return new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig);

        imap.once('ready', () => {
            imap.openBox('INBOX', false, (err, box) => {
                if (err) {
                    console.error('Error opening inbox:', err);
                    imap.end();
                    return reject(err);
                }

                // Decydujemy o kryteriach wyszukiwania na podstawie zmiennej checkRead
                const searchCriteria = checkSeen ? ['ALL'] : ['UNSEEN'];
                console.log(`Searching for ${checkSeen ? 'ALL' : 'UNSEEN'} emails`);

                // Search for emails based on our criteria
                imap.search(searchCriteria, (err, results) => {
                    if (err) {
                        console.error('Error searching emails:', err);
                        imap.end();
                        return reject(err);
                    }

                    if (results.length === 0) {
                        console.log('No emails found matching criteria');
                        imap.end();
                        return resolve(true);
                    }

                    console.log(`Found ${results.length} emails`);

                    // Decide whether to mark as seen based on checkRead
                    // Jeśli pobieramy wszystkie, nie oznaczamy ponownie przeczytanych
                    const markSeen = !checkSeen;
                    const fetch = imap.fetch(results, { bodies: '', markSeen: markSeen });

                    // Liczniki dla statystyk
                    let totalProcessed = 0;
                    let whitelistedCount = 0;

                    fetch.on('message', (msg, seqno) => {
                        totalProcessed++;
                        console.log(`Processing email #${seqno}`);

                        // Pobierz również flagi wiadomości, aby sprawdzić, czy jest już przeczytana
                        let isSeen = false;

                        msg.once('attributes', (attrs) => {
                            const flags = attrs.flags as string[] | undefined;
                            isSeen = Array.isArray(flags) && flags.includes('\\Seen');
                        });

                        msg.on('body', (stream) => {
                            let buffer = '';

                            stream.on('data', (chunk) => {
                                buffer += chunk.toString('utf8');
                            });

                            stream.once('end', () => {
                                // Parse email
                                simpleParser(buffer)
                                    .then((parsed) => {
                                        // Sprawdź, czy nadawca jest na białej liście
                                        const fromAddress = parsed.from?.value?.[0]?.address as string || '';
                                        const isWhitelisted = isEmailWhitelisted(fromAddress);
                                        // console.log("parsed", parsed.subject);
                                        const isSubjectAllowed = isSubjectWhitelisted(parsed.subject as string);
                                        console.log("isWhitelisted", fromAddress, isWhitelisted);
                                        console.log("isSubjectAllowed", parsed.subject, isSubjectAllowed);

                                        if (isWhitelisted && isSubjectAllowed) {
                                            whitelistedCount++;
                                            const date = extractDateFromSubject(parsed.subject as string);
                                            console.log("date", date);
                                            // Log email details with read status
                                            // console.log('\n==== NEW EMAIL (WHITELISTED) ====');
                                            // console.log('Status:', isSeen ? 'Read' : 'Unread');
                                            // console.log('From:', parsed.from?.text);
                                            // console.log('To:', parsed.to?.text);
                                            // console.log('Subject:', parsed.subject);
                                            // console.log('Date:', parsed.date);
                                            // console.log('\nText Content:');
                                            // console.log(parsed.text);

                                            if (parsed.attachments && parsed.attachments.length > 0) {
                                                console.log('\nAttachments:');
                                                parsed.attachments.forEach((attachment, index) => {
                                                    console.log(`  [${index + 1}] ${attachment.filename} (${attachment.size} bytes)`);
                                                });
                                            }
                                            console.log('==== END EMAIL ====\n');

                                            // Tutaj możesz dodać dalsze przetwarzanie dla zaufanych adresów
                                            // Na przykład:
                                            // processWhitelistedEmail(parsed);
                                        } else {
                                            // Krótka informacja o pominięciu emaila spoza białej listy
                                            console.log(`Skipping email #${seqno} from ${fromAddress} - not in whitelist or subject not allowed`);
                                        }
                                    })
                                    .catch(err => {
                                        console.error('Error parsing email:', err);
                                    });
                            });
                        });
                    });

                    fetch.once('error', (err: Error) => {
                        console.error('Fetch error:', err);
                        reject(err);
                    });

                    fetch.once('end', () => {
                        console.log(`Done fetching all emails. Processed: ${totalProcessed}, Whitelisted: ${whitelistedCount}`);
                        imap.end();
                        resolve(true);
                    });
                });
            });
        });

        imap.once('error', (err: Error) => {
            console.error('IMAP connection error:', err);
            reject(err);
        });

        imap.once('end', () => {
            console.log('IMAP connection ended');
        });

        imap.connect();
    });
}

// const every10Seconds = '*/10 * * * * *';
const everyMinute = '*/1 * * * *';
const every5Minutes = '*/5 * * * *';
// const every10Minutes = '*/10 * * * *';
// const every30Minutes = '*/30 * * * *';
// const everyHour = '0 * * * *';

// cron.schedule(everyMinute, () => {
//     void autoReceiveEmail();
// });

export default autoReceiveEmail;
