import os

from openai import AzureOpenAI
from dotenv import load_dotenv

def embed_chunk(chunk):

    load_dotenv()

    client = AzureOpenAI(
    api_key = os.getenv("AZURE_OPENAI_KEY"),  
    api_version = "2023-05-15",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT") 
    )

    response = client.embeddings.create(
        input = chunk,
        model= "text-embedding-ada-002"
    )

    return(response.data[0].embedding)

if __name__ == "__main__":
    embed_chunk("The lazy brown fox")