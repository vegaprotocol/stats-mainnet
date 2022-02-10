import { useState } from 'react';

export const Header = () => {
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  }

  return (
    <header className="flex items-center justify-between py-4 lg:pt-6">
      <svg width="111" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10.371 20.794 17.183.02h3.42l-8.436 23.965H8.471L0 .02h3.48l6.891 20.774ZM34.994 13.019v8.249h13.382v2.716H31.782V.019h16.3v2.715H34.994v7.577h11.658v2.708H34.994ZM61.25 2.92h2.88v18.195h-2.88V2.92ZM75.653 0v2.92H64.129V0h11.525ZM64.129 24v-2.885h11.525V24H64.129Zm14.405-2.885h-2.88v-5.77h-5.762v-2.89h8.642v8.66Zm0-18.195v2.884h-2.88V2.92h2.88ZM110.71 23.984h-3.354l-1.763-4.826h-12.03L91.8 23.984h-3.279L97.807.019h3.626l9.277 23.965ZM99.528 2.904l-4.949 13.544h10.002L99.597 2.903h-.07Z"></path></svg>
      
      <button onClick={toggleDarkMode} aria-label="Switch theme color" className="transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-900 rounded-full cursor-pointer">       
        { darkMode ? (
          <svg width="45" height="45">
            <path d="M28.75 11.69A12.39 12.39 0 0 0 22.5 10a12.5 12.5 0 1 0 0 25c2.196 0 4.353-.583 6.25-1.69A12.46 12.46 0 0 0 35 22.5a12.46 12.46 0 0 0-6.25-10.81Zm-6.25 22a11.21 11.21 0 0 1-11.2-11.2 11.21 11.21 0 0 1 11.2-11.2c1.246 0 2.484.209 3.66.62a13.861 13.861 0 0 0-5 10.58 13.861 13.861 0 0 0 5 10.58 11.078 11.078 0 0 1-3.66.63v-.01Z" fill="currentColor"></path>
          </svg>
        ) : (
          <svg width="45" height="45">
            <g>
              <path d="M22.5 27.79a5.29 5.29 0 1 0 0-10.58 5.29 5.29 0 0 0 0 10.58Z" fill="currentColor"></path>
              <path d="M15.01 22.5H10M35 22.5h-5.01M22.5 29.99V35M22.5 10v5.01M17.21 27.79l-3.55 3.55M31.34 13.66l-3.55 3.55M27.79 27.79l3.55 3.55M13.66 13.66l3.55 3.55" stroke="currentColor" stroke-width="1.3" stroke-miterlimit="10"></path>
            </g>
          </svg>
        ) }
      </button>
    </header>
  );
};
