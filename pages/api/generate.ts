import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { PineconeClient } from "pinecone-client";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_BASE_URL) {
  throw new Error("Missing env var from Pinecone");
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type Metadata = { query: string; response: string };
const pinecone = new PineconeClient<Metadata>({
  apiKey: process.env.PINECONE_API_KEY,
  baseUrl: process.env.PINECONE_BASE_URL,
  namespace: "", // Optional: Insert your namespace
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = (await req.body) as {
    query?: string;
  };

  if (!query) {
    res.status(400).json({ result: "No query in the request" });
    return;
  }

  const response = await openai.createEmbedding({
    input: query,
    model: "text-embedding-ada-002",
  });

  const input_vector = response.data.data[0].embedding;

  const { matches }: { matches: any[] } = await pinecone.query({
    vector: input_vector,
    topK: 3,
    includeMetadata: true,
    includeValues: false,
  });

  const context = matches
    .map((match) => match.metadata.text)
    .join("\n\n##\n\n");

  const relevantPages = matches.map((match) => match.metadata.page_number);

  const prompt = `Answer the question based on the context below and if the question can't be answered based on the context, say \"I cannot find the answer to your question in the document.\"\n\n###\n\nContexts:\n${context}\n\n###\n\nQuestion: ${query}\nAnswer: `;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    best_of: 1,
    max_tokens: 512,
  });

  const result = completion.data.choices[0].text?.trim();

  res.status(200).json({ result, relevantPages });
};

export default handler;
