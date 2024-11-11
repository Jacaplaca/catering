#!/bin/bash

# Source the shared environment loading script
source $(dirname $(realpath $0))/load_env.sh "$1"

# Enter the Docker container and run mongosh to drop the specified database and remove the user
sudo docker exec -it $MONGO_INITDB_SERVICE_NAME bash -c "
  mongosh \"$CONNECTION_STRING\" --quiet --eval '
    var dbName = \"$DATABASE_NAME\";
    var username = \"$MONGO_INITDB_DATABASE_USERNAME\";

    // Drop the database
    db.getSiblingDB(dbName).dropDatabase();
    print(\"Database '\" + dbName + \"' has been dropped.\");

    // Remove the user
    db.getSiblingDB(dbName).dropUser(username);
    print(\"User '\" + username + \"' has been removed from database '\" + dbName + \"'.\");
  '
"
