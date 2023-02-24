import pandas as pd
from PyPDF2 import PdfReader


def extract_pages(
    filename: str,
    index: int,
    page_text: str,
):
    """
    Extract the text from the page
    """
    if len(page_text) == 0:
        return []

    content = " ".join(page_text.replace("\n", " ").split())
    outputs = [(f"{filename}-{index}", "Page " + str(index), content)]

    return outputs


def create_dataset(filename: str):
    reader = PdfReader(f'data/{filename}.pdf')

    res = []
    i = 1
    for page in reader.pages:
        res += extract_pages(filename, i, page.extract_text())
        i += 1
    df = pd.DataFrame(res, columns=["id", "page_number", "text"])

    df.to_csv(f'data/{filename}.pages.csv', index=False)


create_dataset('')  # insert your filename
