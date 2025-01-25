import React from 'react';
import { BiReset, BiCrop, BiRuler } from 'react-icons/bi';
import { FiMove, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { BsCursor } from 'react-icons/bs';

interface ImageToolbarProps {
  onToolSelect: (tool: string) => void;
  selectedTool: string | null;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
}

const ImageToolbar: React.FC<ImageToolbarProps> = ({
  onToolSelect,
  selectedTool,
  onZoomIn,
  onZoomOut,
  onReset,
  scale
}) => {
  return (
    <div className="w-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col gap-2 border-2 border-gray-700 dark:border-gray-500">
      <button
        className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
          selectedTool === 'cursor' 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        onClick={() => onToolSelect('cursor')}
        title="Selection Tool"
      >
        <BsCursor size={20} />
      </button>

      <button
        className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
          selectedTool === 'pan' 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        onClick={() => onToolSelect('pan')}
        title="Pan Tool"
      >
        <FiMove size={20} />
      </button>
      
      <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
      
      <button
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center
                   hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-md"
        onClick={onZoomIn}
        title="Zoom In"
      >
        <FiZoomIn size={20} />
      </button>
      
      <button
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center
                   hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-md"
        onClick={onZoomOut}
        title="Zoom Out"
      >
        <FiZoomOut size={20} />
      </button>
      
      <button
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center
                   hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-md"
        onClick={onReset}
        title="Reset View"
      >
        <BiReset size={20} />
      </button>

      <button
        className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
          selectedTool === 'crop' 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        onClick={() => onToolSelect('crop')}
        title="Crop Tool"
      >
        <BiCrop size={20} />
      </button>

      <button
        className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
          selectedTool === 'measure' 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        onClick={() => onToolSelect('measure')}
        title="Measurement Tools"
      >
        <BiRuler size={20} />
      </button>
    </div>
  );
};

export default ImageToolbar; 