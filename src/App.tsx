import React from 'react';
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo-client";
import { Stats } from "./components"

function App() {
  return (
    <ApolloProvider client={client}>
      <Stats />
    </ApolloProvider>
  );
}

export default App;
