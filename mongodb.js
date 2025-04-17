const { MongoClient, ObjectId } = require('mongodb');

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "testdb";

console.log("attempting to connect");

const Id = new ObjectId();
console.log(Id);

const client = new MongoClient(connectionURL);

const main = async () => {
    try{
        await client.connect();
        console.log("connected successfully to Mongodb!");
        const db = client.db(databaseName);
        const result = await db.collection('users').insertOne({
            Name: "Ismail Amin",
            Age: 18.2
        });
        console.log('inserted id: ', result.insertedId);
    } catch (error) {
        console.error("Error: ", error)
    } finally {
        await client.close();
        console.log("connection closed successfully");
    }
}
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
