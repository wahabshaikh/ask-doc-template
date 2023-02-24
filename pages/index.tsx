import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { toast } from "react-hot-toast";
import LoadingDots from "../components/LoadingDots";

const exampleQuestions: string[] = [];

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [askedQuery, setAskedQuery] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [relevantPages, setRelevantPages] = useState("");

  const handleSubmitForm = async (e: any) => {
    e.preventDefault();
    fetchResponse(query);
  };

  const fetchResponse = async (question: string) => {
    try {
      if (!question) {
        toast.error("Please provide a query!");
        return;
      }

      setAskedQuery(question);
      setGeneratedResponse("");
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: question.trim(),
        }),
      });

      if (!res.ok) {
        setLoading(false);
        toast.error("Something went wrong!");
        throw new Error(res.statusText);
      }

      const data = await res.json();

      setGeneratedResponse(data.result);
      setRelevantPages(data.relevantPages.join(", "));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetQuestion = async (question: string) => {
    setQuery(question);
    fetchResponse(question);
  };

  return (
    <div className="flex min-h-screen">
      <Head>
        <title>AskDoc</title>
      </Head>
      <div className="flex flex-1 flex-col justify-center py-6 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 relative inline-block mb-7">
              Template
              <span className="absolute right-0 text-sm font-medium italics top-full">
                by AskDoc
              </span>
            </h2>
          </div>

          <div className="mt-6">
            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div>
                <label
                  htmlFor="query"
                  className="flex mt-10 items-center space-x-3 mb-3"
                >
                  <p className="mt-2 text-sm text-gray-600">
                    Ask your question
                  </p>
                </label>

                <div className="mt-1">
                  <textarea
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    placeholder={""}
                    required
                  />
                </div>
              </div>

              <div>
                {!loading && (
                  <button
                    className="bg-black rounded-md text-white font-medium px-4 py-2 hover:bg-black/80 w-full"
                    onClick={handleSubmitForm}
                  >
                    Generate the response &rarr;
                  </button>
                )}
                {loading && (
                  <button
                    className="bg-black rounded-md text-white font-medium px-4 py-2 hover:bg-black/80 w-full"
                    disabled
                  >
                    <LoadingDots color="white" style="large" />
                  </button>
                )}
              </div>
            </form>

            {!!generatedResponse?.length && (
              <div className="block lg:hidden">
                <hr className="h-px my-6 bg-gray-200 border-0 mt-12 " />
                <div className="bg-white">
                  <p className="mb-2 text-sm text-gray-500">Response</p>
                  <p>{generatedResponse}</p>
                  {generatedResponse !==
                  "I cannot find the answer to your question in the document." ? (
                    <p className="mt-4 text-sm text-gray-500">
                      Please refer{" "}
                      <span className="font-bold">{relevantPages}</span> of the
                      document.
                    </p>
                  ) : null}
                </div>
              </div>
            )}

            <div className="my-6">
              <h3 className="mb-4 font-semibold">Examples Questions</h3>
              <ul className="space-y-2">
                {exampleQuestions.map((question, index) => (
                  <li
                    onClick={() => handlePresetQuestion(question)}
                    className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 text-sm cursor-pointer hover:bg-gray-200 hover:text-gray-600 hover:border-gray-200 duration-300 transition-colors"
                    key={question}
                  >
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:flex justify-between items-center bg-[#061c2b]">
        {!!generatedResponse?.length && (
          <div className="bg-white rounded-lg p-4 z-10 mx-auto w-10/12 shadow-xl border border-gray-100">
            <p className="mb-2 text-sm text-gray-500">{askedQuery}</p>
            <p>{generatedResponse}</p>
            {generatedResponse !==
            "I cannot find the answer to your question in the document." ? (
              <p className="mt-4 text-sm text-gray-500">
                Please refer <span className="font-bold">{relevantPages}</span>{" "}
                of the document.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
