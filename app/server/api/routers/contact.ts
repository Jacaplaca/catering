import { createTRPCRouter, publicProcedure } from "server/api/trpc";
import { contactFormValidator } from '@root/app/validators/contact';
import sendContactRequest from '@root/app/server/email/contactRequest';
import { getTranslation } from '@root/app/server/cache/translations';
import { getSetting } from '@root/app/server/cache/settings';

export const contactRouter = createTRPCRouter({
    sendMessage: publicProcedure
        .input(contactFormValidator)
        .mutation(async ({ input }) => {
            const maxMessageLength = await getSetting<number>('contact', 'maxMessageLength');
            const { lang, message, email } = input;

            if (message.length > maxMessageLength) {
                const errorTranslation = await getTranslation(lang, 'contact:form-error-to-long');
                throw new Error(errorTranslation);
            }

            await sendContactRequest({
                message,
                senderEmail: email,
                lang
            })

            return {
                email: input.email,
                message: input.message
            }
        })
});