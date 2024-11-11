#!/bin/bash

# Source the shared environment loading script
source $(dirname $(realpath $0))/load_env.sh "$1"

# Enter the Docker container and run mongosh to execute the necessary operations
sudo docker exec $MONGO_INITDB_SERVICE_NAME bash -c "
  mongosh \"$CONNECTION_STRING\" --quiet --eval '
    var userCount = db.getSiblingDB(\"$DATABASE_NAME\").getUsers().users.length;
    print(\"Number of users in database '\$DATABASE_NAME': \" + userCount);

    if (userCount === 0) {
      var username = \"$MONGO_INITDB_DATABASE_USERNAME\";
      var password = \"$MONGO_INITDB_DATABASE_PASSWORD\";
      var dbName = \"$MONGO_INITDB_DATABASE_NAME\";

      // Create the new user
      db.getSiblingDB(\"$DATABASE_NAME\").createUser({
        user: username,
        pwd: password,
        roles: [
          {
            role: \"readWrite\",
            db: dbName
          }
        ]
      });
      print(\"New user created in database '\$DATABASE_NAME'.\");
    } else {
      print(\"No new user created as there are existing users in the database '\$DATABASE_NAME'.\");
    }
  '
"
