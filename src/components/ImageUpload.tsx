import React, { useCallback, useState, DragEvent } from 'react';
import { useThemeClass } from '../hooks/useThemeClass.ts';
import ImageViewer from './image/ImageViewer.tsx';

const ImageUpload = () => {
  const { getSecondaryClass, getTextClass } = useThemeClass();
  const [imageUrl, setImageUrl] = useState(null);
  
  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      console.log('Created image URL:', url);
      setImageUrl(url);
    }
  };

  if (imageUrl) {
    return <ImageViewer imageUrl={imageUrl} />;
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <div
        className={`${getSecondaryClass()} ${getTextClass()} flex flex-col items-center justify-center h-fit w-fit p-8 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <h1 className="text-2xl font-bold text-center pb-8">Upload Medical Image</h1>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload; 