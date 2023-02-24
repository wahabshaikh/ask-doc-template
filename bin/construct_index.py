import openai
import pinecone
import pandas as pd
from time import sleep
from tqdm.auto import tqdm

openai.api_key = ""  # insert your openai api key

pinecone.init(
    api_key="",  # insert your pinecone api key
    environment=""  # insert your pinecone environment
)

embed_model = "text-embedding-ada-002"
index_name = ""  # insert your index name

index = pinecone.Index(index_name)


def construct_index(filename: str):
    df = pd.read_csv(f'data/{filename}.pages.csv')

    batch_size = 10  # how many embeddings we create and insert at once

    for i in tqdm(range(0, len(df), batch_size)):
        # find end of batch
        i_end = min(len(df), i+batch_size)

        batch = df[i:i_end]

        # get ids
        ids_batch = batch['id'].tolist()

        # get texts to encode
        texts_batch = batch['text'].tolist()

        # create embeddings (try-except added to avoid RateLimitError)
        try:
            res = openai.Embedding.create(
                input=texts_batch, engine=embed_model)
        except:
            done = False
            while not done:
                sleep(5)
                try:
                    res = openai.Embedding.create(
                        input=texts_batch, engine=embed_model)
                    done = True
                except:
                    pass

        vectors_batch = [record['embedding'] for record in res['data']]

        # cleanup metadata
        metadata_batch = batch[['page_number', 'text']]
        metadata_batch['doc'] = f'{filename}'

        to_upsert = list(zip(ids_batch, vectors_batch,
                         metadata_batch.to_dict('records')))

        # upsert to Pinecone
        # Optional: Insert a namespace
        index.upsert(vectors=to_upsert, namespace='')


construct_index('')  # insert your filename
