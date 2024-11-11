// Przechodzimy do bazy danych określonej przez zmienną środowiskową
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE_NAME);
db.createUser({
    user: process.env.MONGO_INITDB_DATABASE_USERNAME,
    pwd: process.env.MONGO_INITDB_DATABASE_PASSWORD,
    roles: [
         {
             role: 'readWrite',
             db: process.env.MONGO_INITDB_DATABASE_NAME
         }
     ]
});

const my_user = db.getUsers();
print(my_user);