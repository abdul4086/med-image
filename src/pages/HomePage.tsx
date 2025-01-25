import React from 'react';
import { useThemeClass } from '../hooks/useThemeClass.ts';
import ImageUpload from '../components/ImageUpload.tsx';

const HomePage = () => {
  const { getBackgroundClass, getTextClass, container } = useThemeClass();

  return (
    <div className={`${getBackgroundClass()} ${getTextClass()} flex flex-col h-full w-full items-center justify-center`}>
      <div className={`${container} flex flex-col items-center justify-center h-full w-full`}>
        <ImageUpload />
      </div>
    </div>
  );
};

export default HomePage;
