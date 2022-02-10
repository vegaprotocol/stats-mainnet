import React, { useState } from 'react';
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo-client";
import { Header } from "./components/header";
import { StatsTable } from "./components/statsTable";
import { StatsBanner } from "./components/statsBanner";

function App() {
  return (
    <div className="w-screen h-screen grid bg-white text-black dark:bg-black dark:text-white">
      <div className="layout-grid w-screen max-w-xl justify-self-center">
        <ApolloProvider client={client}>
          <Header />
          <StatsBanner />
          <StatsTable />
        </ApolloProvider>
      </div>
    </div>
  );
}

export default App;
