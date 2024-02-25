import os
import glob

def list_md_file():
    return(glob.glob(os.getcwd() + '\scrape\openai\**\*.md', recursive=True))

if __name__ == "__main__":
    print(list_md_file())