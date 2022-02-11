import React, { useState } from 'react';
import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo-client";
import { Header } from "./components/header";
import { StatsTable } from "./components/statsTable";

function App() {
  return (
    <div className="w-screen h-screen grid bg-white dark:bg-black text-neutral-900 dark:text-neutral-200">
      <div className="layout-grid w-screen max-w-3xl justify-self-center p-5">
        <ApolloProvider client={client}>
          <Header />
          <StatsTable />
        </ApolloProvider>
      </div>
    </div>
  );
}

export default App;
