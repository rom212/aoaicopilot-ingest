import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

const apiKey = process.env["AZURE_SEARCH_API_KEY"];
const searchClient = new SearchClient(
  "https://romullassistant.search.windows.net",
  "aoaidocs",
  new AzureKeyCredential(apiKey)
);

export async function search(query, queryVector) {
  const searchResults = await searchClient.search("*", {
    vectorSearchOptions: {
      queries: [
        {
          kind: "vector",
          fields: ["chunkVector"],
          kNearestNeighborsCount: 3,
          vector: queryVector,
        },
      ],
    },
  });
  for await (const result of searchResults.results) {
    console.log(result);
  }
}
