import React from 'react';
import './App.css';
import Routes from './routes.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

function App() {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen">
        <Routes />
      </div>
    </ThemeProvider>
  );
}

export default App;
