db = db.getSiblingDB('admin');
print('-------------------------current db-------------------------------------: ' + db.getName());
print('env', process.env)
// Modyfikujemy role użytkownika admin, dodając clusterAdmin oraz root
db.createUser({
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [
        { role: "userAdminAnyDatabase", db: "admin" },
        { role: "readWriteAnyDatabase", db: "admin" },
        { role: "dbAdminAnyDatabase", db: "admin" },
        { role: "clusterAdmin", db: "admin" }, // Dodano role clusterAdmin
        { role: "root", db: "admin" } // Dodano role root dla pełnego dostępu
    ]
});
const admin = db.getUsers();
print(admin);