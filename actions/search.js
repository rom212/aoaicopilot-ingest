import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

const apiKey = process.env["AZURE_SEARCH_API_KEY"];
const index = process.env["AZURE_SEARCH_INDEX"];
const search_endpoint = process.env["AZURE_SEARCH_ENDPOINT"];

const searchClient = new SearchClient(
  search_endpoint,
  index,
  new AzureKeyCredential(apiKey)
);

export async function search(query, queryVector) {
  let results = [];
  const searchResults = await searchClient.search("*", {
    vectorSearchOptions: {
      queries: [
        {
          kind: "vector",
          fields: ["chunkVector"],
          kNearestNeighborsCount: 5,
          vector: queryVector,
        },
      ],
    },
  });
  for await (const result of searchResults.results) {
    results.push({
      chunkText: result.document.chunkText,
      chunkUrl: result.document.chunkUrl,
    });
  }
  return results;
}
