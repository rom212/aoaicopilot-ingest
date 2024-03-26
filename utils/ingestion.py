import os
import requests
import json
import time

from dotenv import load_dotenv

from split import split_md
from embed import embed_chunk
from index import create_id
from files import list_md_file, map_name_to_url

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

processed_files = 0
processed_chunks = 0
indexing_errors = 0

start_time = time.time()

for file in files:
    chunks = split_md(file)
    chunkUrl = map_name_to_url(file)
    print("Processing content at: ", chunkUrl)
    for chunk in chunks:
        print(f"Processing file {processed_files + 1} out of {nb_file}")
        embedding = embed_chunk(chunk)
        id = create_id(chunk)
        payload = {
            "value": [
                {
                    "@search.action": "upload",
                    "id" : id,
                    "chunkText": chunk,
                    "chunkUrl": chunkUrl,
                    "chunkVector": embedding
                }
            ]
        }
        try:
            r = requests.post(url, data=json.dumps(payload), headers=headers, timeout=40)
        except:
            print("error posting a chunk")
            print("Document creation status code: ", r.status_code)
            indexing_errors += 1
        print("Document creation status code: ", r.status_code)
        print(f"nb of documents created: {processed_chunks}")
        processed_chunks += 1
    del chunks
    processed_files += 1

end_time = time.time()

print("Process ended..")
print(f"Processed {processed_files} files out of {nb_file}")
print(f"Total number of indexing errors: {indexing_errors}")
print(f"nb of documents created: {processed_chunks}")
print("Elapsed time was %g seconds" % (end_time - start_time))
