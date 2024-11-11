import { api } from '@root/app/trpc/react';
import { MealType } from '@root/types/specific';
import { useEffect, useState } from 'react';

export type MealPdfData = {
    summaryStandard: number;
    standard: { meals: number; clientCode: string }[];
    diet: Record<string, { consumerCode: string, diet: string }[]>;
}

const useMealPdf = (lang: LocaleApp) => {
    const [dayId, setDayId] = useState<string | null>(null);
    const [mealType, setMealType] = useState<MealType | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const { data: pdfData } = api.specific.order.dayPdf.useQuery(
        { dayId: dayId ?? '', mealType: mealType ?? MealType.Breakfast, lang },
        { enabled: Boolean(dayId) && Boolean(mealType) }
    );

    const handleDownload = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, { dayId, mealType }: { dayId: string, mealType: MealType }) => {
        e.stopPropagation();
        setIsLoading(true);
        setDayId(dayId);
        setMealType(mealType);
    };

    useEffect(() => {
        if (pdfData) {
            const { base64Pdf, contentType, fileName } = pdfData;

            const byteCharacters = atob(base64Pdf);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const blob = new Blob([byteArray], { type: contentType });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
            setIsLoading(false);
            setDayId(null);
            setMealType(null);
        }
    }, [pdfData]);

    return {
        isLoading,
        handleDownload,
        dayIdForPdf: dayId,
        mealTypeForPdf: mealType,
    };
};

export default useMealPdf;
