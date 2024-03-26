import os

from openai import AzureOpenAI
from dotenv import load_dotenv

def embed_chunk(chunk):

    load_dotenv()
    embedding_model = os.getenv("AZURE_EMBEDDING_MODEL")

    client = AzureOpenAI(
    api_key = os.getenv("AZURE_OPENAI_KEY"),  
    api_version = "2023-05-15",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT") 
    )

    response = client.embeddings.create(
        input = chunk,
        model= embedding_model
    )

    return(response.data[0].embedding)

if __name__ == "__main__":
    embed_chunk("The lazy brown fox")