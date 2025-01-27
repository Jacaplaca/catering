import nodemailer from "nodemailer";
import { getSettingsGroup } from '@root/app/server/cache/settings';
import { env } from '@root/app/env';
import { type CustomEmailSettings } from '@root/app/server/email/libs/sendEmail';

const getSmtpOptions = async (customOptions?: CustomEmailSettings['options']) => {
    if (customOptions) {
        return customOptions;
    }
    const settings = await getSettingsGroup('email', true) as {
        host: string;
        port: number;
        username: string;
        password: string;
    };

    if (env.NODE_ENV === "development") {
        return {
            host: 'localhost',
            ignoreTLS: true,
            maxConnections: 10,
            port: 25,
            secure: false,
        };
    }
    return {
        // from: env.EMAIL_FROM,
        host: settings.host,
        port: settings.port,
        auth: {
            user: settings.username,
            pass: settings.password,
        },
        // secure: true,
        maxConnections: 10,
        tls: {
            rejectUnauthorized: false,
        },
    };
};

const getSmtpTransport = async (customOptions?: CustomEmailSettings['options']) => {
    const options = await getSmtpOptions(customOptions);
    return nodemailer.createTransport(options);
};

export default getSmtpTransport;
