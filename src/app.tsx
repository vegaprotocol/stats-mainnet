import React from 'react';
import { Header } from './components/header';
import { StatsManager } from './components/stats-manager';

function App() {
  return (
    <div className="w-screen h-screen grid bg-white dark:bg-black text-neutral-900 dark:text-neutral-200">
      <div className="layout-grid w-screen justify-self-center">
        <Header />
        <StatsManager />
      </div>
    </div>
  );
}

export default App;
