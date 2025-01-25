import React from 'react';
import { useThemeClass } from '../hooks/useThemeClass.ts';
import ImageUpload from '../components/ImageUpload.tsx';

const HomePage = () => {
  const { getBackgroundClass, getTextClass } = useThemeClass();

  return (
    <div className={`${getBackgroundClass()} ${getTextClass()} h-full w-full`}>
      <ImageUpload />
    </div>
  );
};

export default HomePage;
