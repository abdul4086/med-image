import React from 'react';
import './App.css';
import Routes from './routes.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

function App() {
  return (
    <ThemeProvider>
      <div className="flex h-full w-full">
        <Routes />
      </div>
    </ThemeProvider>
  );
}

export default App;
