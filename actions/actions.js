"use server";
import OpenAI from "openai";
import { MongoClient, ServerApiVersion } from "mongodb";
import { embed } from "./embedding";
import { search } from "./search";

const resource = process.env["AOAI_RESOURCE"];
const model = process.env["MODEL_DEPLOYMENT"];
const apiVersion = process.env["API_VERSION"];
const apiKey = process.env["AZURE_OPENAI_API_KEY"];
const username = process.env["MONGO_WRITE_USER"];
const password = process.env["MONGO_WRITE_PASSWORD"];
const dbName = process.env["MONGO_DB_NAME"];
const collectionName = process.env["MONGO_COLLECTION_NAME"];

const openai = new OpenAI({
  apiKey,
  baseURL: `https://${resource}.openai.azure.com/openai/deployments/${model}`,
  defaultQuery: { "api-version": apiVersion },
  defaultHeaders: { "api-key": apiKey },
});

const uri = `mongodb+srv://${username}:${password}@aoaicopilot.hjebngd.mongodb.net/?retryWrites=true&w=majority&appName=aoaicopilot`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const manageThread = (thread, searchResults) => {
  const cleanThread = thread.map((message) => ({
    role: message.role,
    content: message.content,
  }));
  const stuffedSystemPrompt =
    cleanThread[0].content + "/n" + searchResults.join("\n");
  cleanThread.splice(0, 1, { role: "system", content: stuffedSystemPrompt });
  if (cleanThread.length > 4) {
    return [
      cleanThread[0],
      ...cleanThread.slice(cleanThread.length - 3, cleanThread.length),
    ];
  }
  return cleanThread;
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
  } finally {
    await client.close();
  }
};

export async function sendNewMessage(thread, previousState, formData) {
  const userInput = formData.get("inputQuestion");

  const embedding = await embed(userInput);

  const searchResults = await search(userInput, embedding);

  const chunkTextList = searchResults.map((item) => item.chunkText);

  const chunkUrlList = searchResults.map((item) => item.chunkUrl);

  const filteredUrlList = chunkUrlList.filter(
    (item) => !item.includes("openai/includes")
  );

  const dedupedChunkUrlList = [...new Set(filteredUrlList)];

  const managedThread = manageThread(thread, chunkTextList);

  const payload = [...managedThread, { role: "user", content: userInput }];
  console.log("[sending payload]: ", payload);

  try {
    const result = await openai.chat.completions.create({
      model,
      messages: payload,
    });
    console.log("[received response]: ", result.choices[0].message?.content);
    incrementCounter();
    return {
      status: "success",
      response: result.choices[0].message?.content,
      citations: dedupedChunkUrlList,
    };
  } catch (err) {
    if (err.status == 429) {
      console.log("[error]: Throttled");
      return {
        status: "429",
        response: "Too Many Requests - Please try again later",
      };
    }
  }
}
