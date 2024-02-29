"use server";
import OpenAI from "openai";
import { MongoClient, ServerApiVersion } from "mongodb";
import { embed } from "./embedding";
import { search } from "./search";

const resource = "aoaicopilot";
const model = "gpt-4-turbo";
const apiVersion = "2024-02-15-preview";
const apiKey = process.env["AZURE_OPENAI_API_KEY"];

const openai = new OpenAI({
  apiKey,
  baseURL: `https://${resource}.openai.azure.com/openai/deployments/${model}`,
  defaultQuery: { "api-version": apiVersion },
  defaultHeaders: { "api-key": apiKey },
});

const username = "writeUser";
const password = "joYJ17DcRAlwturn";
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

const manageThread = (thread) => {
  if (thread.length > 4) {
    return [thread[0], ...thread.slice(thread.length - 3, thread.length)];
  }
  return thread;
};

const incrementCounter = async () => {
  await client.connect();
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const findOneQuery = { counter: { $exists: true } };
  try {
    const findOneResult = await collection.findOne(findOneQuery);
    const newCounter = parseInt(findOneResult.counter) + 1;
    const updateDoc = { $set: { counter: newCounter.toString() } };
    const updateOptions = { returnOriginal: false };
    await collection.findOneAndUpdate(findOneQuery, updateDoc, updateOptions);
  } catch (err) {
    console.error(
      `Something went wrong trying to update the counter: ${err}\n`
    );
  }
};

export async function sendNewMessage(thread, previousState, formData) {
  const userInput = formData.get("inputQuestion");
  console.log("Non-streaming:");
  console.log("USER INTPUT: ", userInput);
  const embedding = await embed(userInput);
  console.log("EMBEDDING: ", embedding);
  await search(userInput, embedding);
  const managedThread = manageThread(thread);
  const payload = [...managedThread, { role: "user", content: userInput }];
  console.log("[sending payload]: ", payload);
  const result = await openai.chat.completions.create({
    model,
    messages: payload,
  });
  console.log("[received response]: ", result.choices[0].message?.content);
  incrementCounter();
  return { status: "success", response: result.choices[0].message?.content };
}
