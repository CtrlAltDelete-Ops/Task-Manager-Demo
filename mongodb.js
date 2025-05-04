const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "testdb";

console.log("attempting to connect");

const client = new MongoClient(connectionURL);
j;

const main = async () => {
  try {
    await client.connect();
    console.log("connected successfully to Mongodb!");
    const db = client.db(databaseName);
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId("680337cdecde8709c6a073ff") });
    console.log(user);
    const incompleteTasks = await db
      .collection("Tasks")
      .find({ completed: false })
      .toArray();
    const count = await db
      .collection("Tasks")
      .countDocuments({ completed: false });
    console.log(count);
    const lastTask = await db
      .collection("Tasks")
      .findOne({ _id: new ObjectId("68032e3eedc11a76e0d084ba") });
    console.log(lastTask);

    const deletedDocument = await db.collection("users").deleteOne({
      _id: new ObjectId("680337cdecde8709c6a073ff"),
    });

    console.log(deletedDocument);
  } catch (error) {
    console.log("Error occured: ", error);
  } finally {
    await client.close();
    console.log("connection closed successfully");
  }
};

main();

// const connectingToMongodb = async () => {
//     try {
//         const client = await MongoClient.connect(connectionURL, { serverSelectionTimeoutMS: 5000 })
//         const results = await db.collection("users").insertOne(
//             {
//               name: "Ismail Amin",
//               age: 18,
//             }
//           );
//     } catch (error) {
//         console.error("connection error!");
//         throw error;
//     }

//     const db = client.db(databaseName);

//     db.collection("users").insertOne(
//       {
//         name: "Ismail Amin",
//         age: 18,
//       },
//       (err, result) => {
//         if (err) {
//           console.log("Error: ", err.message);
//           return;
//         }
//         console.log("inserted collection id", result.insertedId);
//       }
//     );

//     db.collection("tasks").insertMany(
//       [
//         {
//           description: "first task",
//           completed: true,
//         },
//         {
//           description: "second task",
//           completed: true,
//         },
//         {
//           description: "third task",
//           completed: true,
//         },
//       ],
//       (err, result) => {
//         if (err) {
//           return console.log("Error! ");
//         }
//         console.log(result.insertedIds);
//       }
//     );

//     client.close(() => {
//       console.log("Connection closed");
//     });
//   }
// ;
