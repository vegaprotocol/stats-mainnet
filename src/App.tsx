import React from 'react';
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo-client";
import { Header } from "./components/header";
import { StatsTable } from "./components/statsTable";
import { StatsBanner } from "./components/statsBanner";

function App() {
  return (
    <ApolloProvider client={client}>
      <Header />
      <StatsBanner />
      <StatsTable />
    </ApolloProvider>
  );
}

export default App;
