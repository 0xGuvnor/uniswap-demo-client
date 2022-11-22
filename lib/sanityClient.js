import sanityClient from "@sanity/client";

export const client = sanityClient({
  projectId: "oofkg2yj",
  dataset: "production",
  apiVersion: "v1",
  token:
    "sktjieNLVzTD6gTxmampzmQvzRn4YxabNE3zCWgJsGqSkirBuBAOJu7bqpyN2l3zQAzmxVEhFWzWteKZvaT8DfOa9cGKAsABU7sSuenjxuC63eH5whTIVCPKUNItD7ih86WKJbfMQlczK2OwPQ5WDeV923aRJZD7cFARCPQUc2JhME2OD8ib",
  useCdn: false,
});
