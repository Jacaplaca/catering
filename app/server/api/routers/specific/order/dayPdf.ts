// import { db } from '@root/app/server/db';
import { createCateringProcedure } from '@root/app/server/api/specific/trpc';
import type { MealType, OrderMealPopulated } from '@root/types/specific';
import { RoleType, type Client, type OrderConsumerBreakfast, type OrderStatus } from '@prisma/client';
// import processMeals from '@root/app/server/api/routers/specific/libs/processMeals';

// import { Document, Font, Page, StyleSheet, Text, View, Svg, Path, pdf as pdfRender } from '@react-pdf/renderer';
// import React from 'react';
import translate from '@root/app/lib/lang/translate';
import { format } from 'date-fns-tz';
import { pl } from 'date-fns/locale';
import { getDict } from '@root/app/server/cache/translations';
import { getOrdersPdfValid } from '@root/app/validators/specific/order';
import safeFileName from '@root/app/lib/safeFileName';
import PDFDocument from 'pdfkit';
import processMeals from '@root/app/server/api/routers/specific/libs/processMeals';
import { db } from '@root/app/server/db';
import { loadFonts } from '@root/app/lib/loadFonts';
import dayIdParser from '@root/app/server/api/routers/specific/libs/dayIdParser';
import returnPdfForFront from '@root/app/server/api/routers/specific/libs/pdf/returnPdfForFront';

const dayPdf = createCateringProcedure([RoleType.kitchen, RoleType.manager])
    .input(getOrdersPdfValid)
    .query(async ({ input, ctx }) => {
        const { session: { catering } } = ctx;
        const { dayId, mealType, lang } = input;

        const { year, month, day } = dayIdParser(dayId);

        const standardFields = {
            breakfast: "breakfastStandard",
            lunch: "lunchStandard",
            dinner: "dinnerStandard",
        }

        const dietsCollections = {
            breakfast: 'OrderConsumerBreakfast',
            lunch: 'OrderConsumerLunch',
            dinner: 'OrderConsumerDinner',
        }

        const dayData = await db.order.aggregateRaw({
            pipeline: [
                {
                    $match: {
                        cateringId: catering.id,
                        status: { $ne: 'draft' },
                        deliveryDay: {
                            year,
                            month,
                            day
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'Client',
                        localField: 'clientId',
                        foreignField: '_id',
                        as: 'client'
                    }
                },
                {
                    $unwind: '$client'
                },
                {
                    $lookup: {
                        from: `${dietsCollections[mealType]}`,
                        let: { orderId: '$_id' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$orderId', '$$orderId'] } } },
                            {
                                $lookup: {
                                    from: 'Consumer',
                                    localField: 'consumerId',
                                    foreignField: '_id',
                                    as: 'consumer'
                                }
                            },
                            { $unwind: '$consumer' }
                        ],
                        as: 'diet'
                    }
                },
                {
                    $addFields: {
                        standard: `$${standardFields[mealType]}`,
                    }
                },
                {
                    $project: {
                        _id: 1,
                        cateringId: 1,
                        clientId: 1,
                        client: 1,
                        status: 1,
                        standard: 1,
                        diet: 1,
                        deliveryDay: 1,
                        note: 1,
                        sentToCateringAt: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]
        }) as unknown as {
            _id: string;
            client: Client;
            status: OrderStatus;
            sentToCateringAt: { $date: Date };
            standard: number;
            note: string;
            diet: (OrderConsumerBreakfast & OrderMealPopulated)[];
        }[]

        const summaryStandard = dayData.reduce((acc, { standard }) => {
            acc += standard;
            return acc;
        }, 0);

        const notes = dayData.reduce((acc, { note, client }) => {
            const code = client?.info?.code;
            if (code) {
                acc[code] = note;
            }
            return acc;
        }, {} as Record<string, string>);

        const standardObject = dayData.reduce((acc, { client, standard }) => {
            const code = client?.info?.code;
            if (code) {
                acc[code] = (acc[code] ?? 0) + standard;
            }
            return acc;
        }, {} as Record<string, number>);

        const dietObject = dayData.reduce((acc, { client, diet }) => {
            const code = client?.info?.code;
            if (code) {
                acc[code] = processMeals(diet);
            }
            return acc;
        }, {} as Record<string, Record<string, { code: string, description: string }>>);


        const standard = Object.entries(standardObject).map(([clientCode, value]) => ({
            clientCode,
            meals: value,
        }));

        const diet = Object.entries(dietObject).reduce((acc, [clientCode, value]) => {
            acc[clientCode] = Object.entries(value).map(([consumerCode, diet]) => ({
                consumerCode,
                diet,
            }));
            return acc;
        }, {} as Record<string, { consumerCode: string, diet: { code: string, description: string } }[]>);

        const dictionary = await getDict({ lang, keys: ['shared', 'orders'] })

        const translations = {
            breakfast: translate(dictionary, 'orders:breakfast'),
            lunch: translate(dictionary, 'orders:lunch'),
            dinner: translate(dictionary, 'orders:dinner'),
        } as Record<MealType, string>

        const deliveryDayDate = new Date(year, month, day);

        const headDate = format(deliveryDayDate, "EEEE d MMM yyyy ", { locale: pl });
        const footerDate = format(deliveryDayDate, "d-MM-yyyy ", { locale: pl });
        const fileNameDate = format(deliveryDayDate, "yyyy-MM-dd ", { locale: pl });

        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
                bufferPages: true,
                font: ''
            });

            const buffers: Buffer[] = [];
            doc.on('data', (chunk: Buffer) => buffers.push(chunk));

            const pdfPromise = new Promise<Buffer>((resolve) => {
                doc.on('end', () => resolve(Buffer.concat(buffers)));
            });

            const fonts = await loadFonts();

            doc.registerFont('Roboto', fonts.regular);
            doc.registerFont('Roboto-Bold', fonts.bold);

            doc.font('Roboto-Bold')
                .fontSize(20)
                .text(translate(dictionary, 'orders:title'), { align: 'center' });

            doc.moveDown();
            doc.fontSize(16)
                .text(`${translations[mealType]} - ${headDate}`, { align: 'center' });

            doc.moveDown(2)
                .fontSize(14)
                .font('Roboto-Bold')
                .text(`${translate(dictionary, 'orders:standard')}: ${summaryStandard}`, { align: 'center' });

            const startY = doc.y + 20;
            const pageWidth = doc.page.width - 100;
            const columnWidth = pageWidth / 2;

            // Split standard array into two columns
            const leftColumn = standard.slice(0, Math.ceil(standard.length / 2));
            const rightColumn = standard.slice(Math.ceil(standard.length / 2));

            // Left column
            let yPosition = startY;
            leftColumn.forEach(item => {
                // Client code in regular font
                doc.font('Roboto')
                    .text(item.clientCode, 50, yPosition, {
                        width: columnWidth / 2,
                        align: 'left'
                    });

                // Meals count in bold
                doc.font('Roboto-Bold')
                    .text(item.meals.toString(), 50 + columnWidth / 3, yPosition, {
                        width: columnWidth / 2,
                        align: 'left'
                    });

                yPosition += 20;
            });

            // Right column
            yPosition = startY;
            rightColumn.forEach(item => {
                // Client code in regular font
                doc.font('Roboto')
                    .text(item.clientCode, 50 + columnWidth, yPosition, {
                        width: columnWidth / 2,
                        align: 'left'
                    });

                // Meals count in bold
                doc.font('Roboto-Bold')
                    .text(item.meals.toString(), 50 + columnWidth + columnWidth / 3, yPosition, {
                        width: columnWidth / 2,
                        align: 'left'
                    });

                yPosition += 20;
            });

            // Update vertical position for next section
            doc.y = Math.max(yPosition, doc.y);

            // Resetujemy pozycję x przed wycentrowaniem tekstu
            doc.x = 50;
            doc.moveDown(4)
                .fontSize(14)
                .font('Roboto-Bold')
                .text(translate(dictionary, 'orders:diet'), {
                    width: pageWidth,
                    align: 'center'
                });

            Object.entries(diet).filter(([_, dietMeals]) => dietMeals.length > 0).forEach(([clientCode, dietMeals]) => {
                doc.moveDown()
                    .fontSize(12)
                    .font('Roboto-Bold')
                    .text(clientCode, 50)
                    .font('Roboto');

                doc.text(notes[clientCode] ?? '', 50);

                dietMeals.forEach(dietMeal => {
                    doc.text(`${dietMeal.consumerCode}: ${dietMeal.diet.code}`, 50);
                });
            });

            const range = doc.bufferedPageRange();
            for (let i = range.start; i < range.start + range.count; i++) {
                doc.switchToPage(i);

                const currentY = doc.y;
                const originalMargins = doc.page.margins;

                doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };

                doc.fontSize(10)
                    .font('Roboto')
                    .text(
                        `${footerDate}     ${i + 1}/${range.count}     ${translations[mealType]}`,
                        0,
                        doc.page.height - 40,
                        {
                            align: 'center',
                            width: doc.page.width,
                            continued: false
                        }
                    );

                // Przywracamy oryginalne marginesy i pozycję Y
                doc.page.margins = originalMargins;
                doc.y = currentY;
            }

            doc.end();

            const fileName = `${safeFileName(translations[mealType])}_${fileNameDate}.pdf`
            return returnPdfForFront({ pdfPromise, fileName });
        } catch (error) {
            console.error('Błąd podczas generowania PDF:', error);
            throw error;
        }

    });

export default dayPdf;
