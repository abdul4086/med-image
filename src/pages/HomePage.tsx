import React from 'react';
import { useThemeClass } from '../hooks/useThemeClass.ts';

const HomePage = () => {
  const { getBackgroundClass, getTextClass, container } = useThemeClass();

  return (
    <div className={`${getBackgroundClass()} ${getTextClass()} min-h-screen h-full w-full`}>
      <div className={container}>
        <h1>Welcome to Home Page</h1>
      </div>
    </div>
  );
};

export default HomePage;
