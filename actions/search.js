import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

const apiKey = process.env["AZURE_SEARCH_API_KEY"];
const searchClient = new SearchClient(
  "https://romullassistant.search.windows.net",
  "aoaidocs",
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
    results.push(result.document.chunkText);
  }
  return results;
}
