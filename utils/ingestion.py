import os
import requests
import json

from dotenv import load_dotenv

from split import split_md
from embed import embed_chunk
from index import create_id
from files import list_md_file

load_dotenv()

api_key = os.getenv("AZURE_SEARCH_ADMIN_API_KEY")
name = os.getenv("AZURE_SEARCH_INDEX_NAME")
endpoint = os.getenv("AZURE_SEARCH_SERVICE_ENDPOINT")
api_verion = os.getenv("API_VERSION")
url = f"{endpoint}/indexes/{name}/docs/index?api-version={api_verion}"

headers = {
    "Content-Type": "application/json",
    "api-key": api_key
}

files = list_md_file()
nb_file = len(files)
count_file = 1
processed_chunks = 0

for file in files:
    chunks = split_md(file)
    for chunk in chunks:
        print(f"Processing file {count_file} out of {nb_file}")
        embedding = embed_chunk(chunk)
        id = create_id(chunk)
        payload = {
            "value": [
                {
                    "@search.action": "upload",
                    "id" : id,
                    "chunkText": chunk,
                    "chunkVector": embedding
                }
            ]
        }
        r = requests.post(url, data=json.dumps(payload), headers=headers)
        print("Document creation status code: ", r.status_code)
        print(f"nb of documents created: {processed_chunks}")
        processed_chunks += 1
    del chunks
    count_file += 1
    