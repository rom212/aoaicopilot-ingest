"use server";
import OpenAI from "openai";

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

export async function sendNewMessage(thread, previousState, formData) {
  const userInput = formData.get("inputQuestion");
  console.log("Non-streaming:");
  const payload = [...thread, { role: "user", content: userInput }];
  const result = await openai.chat.completions.create({
    model,
    messages: payload,
  });
  console.log(result.choices[0].message?.content);
  return { status: "success", response: result.choices[0].message?.content };
}
