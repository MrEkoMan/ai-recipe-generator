// This file defines the data schema and API for the Bedrock integration using AWS Amplify Gen 2 Data.
// It sets up a custom query to interact with Bedrock via a Lambda handler, and configures API authorization.
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';


// Define the data schema using Amplify's schema builder
const schema = a.schema({
  // Custom type to represent the response from Bedrock
  BedrockResponse: a.customType({
    body: a.string(), // The response body from Bedrock
    error: a.string(), // Any error message from Bedrock
  }),

  // Define a custom query to ask Bedrock for a response
  askBedrock: a
    .query()
    .arguments({ ingredients: a.string().array() }) // Accepts an array of ingredient strings
    .returns(a.ref("BedrockResponse")) // Returns a BedrockResponse object
    .authorization((allow) => [allow.authenticated()]) // Only authenticated users can call this query
    .handler(
      a.handler.custom({ entry: "./bedrock.js", dataSource: "bedrockDS" }) // Uses a custom handler in bedrock.js
    ),
});
// Export the schema type for use in the frontend
export type Schema = ClientSchema<typeof schema>;

// Define the data resource with schema and API key authorization
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey", // Use API key as the default auth mode
    apiKeyAuthorizationMode: {
      expiresInDays: 30, // API key expires in 30 days
    },
  },
});


// == STEP 2 ==
// The following commented-out snippet shows how to generate a Data client in your frontend code.
// This client can be used to make CRUDL (Create, Read, Update, Delete, List) requests to your backend.

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

// == STEP 3 ==
// The following commented-out snippet shows how to fetch records from the database in your frontend component.

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
