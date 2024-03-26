import os
import glob
import re

def list_md_file():
    return(glob.glob(os.getcwd() + '\scrape\**\*.md', recursive=True))

def map_name_to_url(mdfile):
    for service in ['ai-services\\openai','search']:
        if service in mdfile:
            suffix = mdfile.split(f"\\scrape\\{service}\\")[-1].split(".md")[0].replace("\\","/")
            service = service.replace("\\","/")
            return(f'https://learn.microsoft.com/en-us/azure/{service}/{suffix}')

if __name__ == "__main__":
    print(map_name_to_url('C:\\Users\\romanmullier\\ro\\demo\\aoaicopilot-ingest\\scrape\\search\\knowledge-store-projections-examples.md'))