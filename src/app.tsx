import React from 'react';
import { Header } from "./components/header";
import { Stats } from "./components/stats";

function App() {
  return (
    <div className="w-screen h-screen grid bg-white dark:bg-black text-neutral-900 dark:text-neutral-200">
      <div className="layout-grid w-screen justify-self-center">
        <Header />
        <Stats />
      </div>
    </div>
  );
}

export default App;