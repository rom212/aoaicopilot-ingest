import requests
import json
import os
import hashlib

from dotenv import load_dotenv

def create_id(chunk):
    return(hashlib.sha1(chunk.encode()).hexdigest())

def create_index():
    
    load_dotenv()
    api_key = os.getenv("AZURE_SEARCH_ADMIN_API_KEY")
    name = os.getenv("AZURE_SEARCH_INDEX_NAME")
    endpoint = os.getenv("AZURE_SEARCH_SERVICE_ENDPOINT")
    api_verion = os.getenv("API_VERSION")
    url = f"{endpoint}/indexes?api-version={api_verion}"

    payload = {
        "name": name,
        "fields": [
        {
            "name": "id", 
            "type": "Edm.String",
            "searchable": False, 
            "filterable": True, 
            "retrievable": True, 
            "sortable": False, 
            "facetable": False,
            "key": True
        },
        {
            "name": "chunkText", 
            "type": "Edm.String",
            "searchable": True, 
            "filterable": False, 
            "retrievable": True, 
            "sortable": True, 
            "facetable": False
        },
        {
            "name": "chunkVector",
            "type": "Collection(Edm.Single)",
            "searchable": True,
            "retrievable": True,
            "dimensions": 1536,
            "vectorSearchProfile": "my-vector-profile"
        },
        ],
        "vectorSearch": {
            "algorithms": [
                {
                    "name": "my-hnsw-vector-config-1",
                    "kind": "hnsw",
                    "hnswParameters": 
                    {
                        "m": 4,
                        "efConstruction": 400,
                        "efSearch": 500,
                        "metric": "cosine"
                    }
                },
            ],
            "profiles": [      
                {
                    "name": "my-vector-profile",
                    "algorithm": "my-hnsw-vector-config-1"
                }
            ]
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "api-key": api_key,
    }
    r = requests.post(url, data=json.dumps(payload), headers=headers)
    print("Index creation status code: ", r.status_code)

if __name__ == "__main__":
    create_index()