import { useState } from 'react';
import { VegaLogo, LightModeToggle, DarkModeToggle } from '../images';
import { VegaBackgroundVideo } from '../videos';

export const Header = () => {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="relative overflow-hidden py-2">
      <VegaBackgroundVideo />

      <div className="relative flex justify-center bg-white dark:bg-black px-2">
        <div className="w-full max-w-3xl p-5 flex items-center justify-between">
          <VegaLogo />

          <button
            onClick={toggleDarkMode}
            aria-label="Switch theme color"
            className="transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-900 rounded-full cursor-pointer"
          >
            {darkMode ? <LightModeToggle /> : <DarkModeToggle />}
          </button>
        </div>
      </div>
    </header>
  );
};
