import { env } from '@root/app/env';
import { db } from '@root/app/server/db';

const staticEmailContext = async (inviterId: string): Promise<Record<string, string>> => {

    const inviter = await db.user.findUnique({
        where: {
            id: inviterId
        }
    })

    if (!inviter?.cateringId) {
        throw new Error("Inviter not found")
    }

    const catering = await db.catering.findUnique({
        where: {
            id: inviter.cateringId
        }
    })

    if (!catering) {
        throw new Error("Catering not found")
    }

    const cateringSettings = catering?.settings

    const cateringName = catering?.name ?? "";
    const contactPhone = cateringSettings?.phone;
    const contactEmail = cateringSettings?.email;
    const logoPath = cateringSettings?.logoLight;
    const logoUrl = logoPath ? `${env.DOMAIN}/file${logoPath}` : null;

    return {
        cateringName,
        contactPhone,
        contactEmail,
        logoUrl
    } as Record<string, string>
}

export default staticEmailContext
