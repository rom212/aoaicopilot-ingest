from langchain.text_splitter import MarkdownHeaderTextSplitter

def split_md(markdown_path):

    headers_to_split_on = [
        ("#", "Header 1"),
        ("##", "Header 2"),
        ("###", "Header 3"),
    ]

    markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)

    with open(markdown_path, 'r', encoding='utf8') as f:
        md_header_splits = markdown_splitter.split_text(f.read())

    chunks = [split.page_content.replace("\n", " ").replace("  ", " ") for split in md_header_splits]

    return(chunks)