const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager-1";

console.log("attempting to connect");

MongoClient.connect(
  connectionURL,
  { serverSelectionTimeoutMS: 5000 },
  (error, client) => {
    if (error) {
      console.log("There was an error connecting to the database!");
      return;
    }
    console.log("Connected to the database correctly");

    const db = client.db(databaseName);

    db.collection("users").insertOne(
      {
        name: "Ismail Amin",
        age: 18,
      },
      (err, result) => {
        if (err) {
          console.log("Error: ", err.message);
          return;
        }
        console.log("inserted collection id", result.insertedId);
      }
    );

    db.collection("tasks").insertMany(
      [
        {
          description: "first task",
          completed: true,
        },
        {
          description: "second task",
          completed: true,
        },
        {
          description: "third task",
          completed: true,
        },
      ],
      (err, result) => {
        if (err) {
          return console.log("Error! ");
        }
        console.log(result.indertedIds);
      }
    );

    client.close(() => {
      console.log("Connection closed");
    });
  }
);
