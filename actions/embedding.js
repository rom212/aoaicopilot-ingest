"use server";
import OpenAI from "openai";

const resource = "aoaicopilot";
const model = "text-embedding-ada-002";
const apiVersion = "2024-02-15-preview";
const apiKey = process.env["AZURE_OPENAI_API_KEY"];

const openai = new OpenAI({
  apiKey,
  baseURL: `https://${resource}.openai.azure.com/openai/deployments/${model}`,
  defaultQuery: { "api-version": apiVersion },
  defaultHeaders: { "api-key": apiKey },
});

export async function embed(content) {
  const result = await openai.embeddings.create({
    input: content,
  });
  //   console.log(result.data[0].embedding);
  return result.data[0].embedding;
}
