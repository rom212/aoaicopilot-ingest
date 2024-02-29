"use server";
import { MongoClient, ServerApiVersion } from "mongodb";

const username = "readOnlyUser";
const password = "zR8GbNVAJT1xmF0Q";
const uri = `mongodb+srv://${username}:${password}@aoaicopilot.hjebngd.mongodb.net/?retryWrites=true&w=majority&appName=aoaicopilot`;

const dbName = "aoaicopilot";
const collectionName = "counter";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function mongoTestConnect() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function fetchCounter() {
  await client.connect();
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  let result = [];
  const findOneQuery = { counter: { $exists: true } };
  try {
    const findOneResult = await collection.findOne(findOneQuery);
    result.push({
      _id: findOneResult._id.toHexString(),
      counter: findOneResult.counter,
    });
  } catch (err) {
    console.error(
      `Something went wrong trying to find the documents: ${err}\n`
    );
  }
  return result[0];
}
