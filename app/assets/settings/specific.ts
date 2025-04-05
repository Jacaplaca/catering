const specificSettings = {
    "PUBLIC:email:fromAlias:STRING": 'Catering',
    "PUBLIC:main:siteName:STRING": 'Catering',
    "PRIVATE:table-columns:consumer-for-manager:STRING_ARRAY": "code, name, diet.code, diet.dietician.name, diet.description, client.code, client.name, createdAt",
    "PRIVATE:table-columns:consumer-for-dietician:STRING_ARRAY": "code, name, diet.code, diet.description, client.code, client.name, createdAt",
    "PRIVATE:table-columns:consumer-for-client:STRING_ARRAY": "code, name, diet.code, createdAt",
    "PRIVATE:table-columns:order-for-client:STRING_ARRAY": "deliveryDay, status, breakfastStandard, breakfastDietCount, lunchStandard, lunchDietCount, dinnerStandard, dinnerDietCount, sentToCateringAt",
    "PRIVATE:table-columns:order-for-kitchen:STRING_ARRAY": "deliveryDay, status, client.name, client.code, breakfastStandard, breakfastDietCount, lunchStandard, lunchDietCount, dinnerStandard, dinnerDietCount, sentToCateringAt",
    "PRIVATE:table-columns:order-for-manager:STRING_ARRAY": "deliveryDay, status, client.name, client.code, breakfastStandard, breakfastDietCount, lunchStandard, lunchDietCount, dinnerStandard, dinnerDietCount, sentToCateringAt",
    "PRIVATE:admin:email:STRING": "admin@catering.com",
    "PRIVATE:admin:phone:STRING": "+48600000000",
    "PUBLIC:client-files:type:STRING_ARRAY": "menu, checklist, diets", //same as ClientFileType enum in prisma
    "PUBLIC:client-files:s3-prefix:STRING": "client-files",
    "PUBLIC:client-files:max-file-size:NUMBER": 10 * 1024 * 1024, // 10MB w bajtach
    "PUBLIC:main:logoDark:STRING": 'default/ekoplanet_transparent.png',
    "PUBLIC:main:logoLight:STRING": 'default/ekoplanet_transparent.png',
}

export default specificSettings;