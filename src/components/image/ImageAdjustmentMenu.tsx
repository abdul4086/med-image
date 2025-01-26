import React, { useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

interface ImageAdjustmentMenuProps {
  onClose: () => void;
  setBrightness: (value: number) => void;
  setContrast: (value: number) => void;
}

const ImageAdjustmentMenu: React.FC<ImageAdjustmentMenuProps> = ({ onClose, setBrightness, setContrast }) => {
  const [localBrightness, setLocalBrightness] = useState(100);
  const [localContrast, setLocalContrast] = useState(100);

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalBrightness(value);
    setBrightness(value);
  };

  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalContrast(value);
    setContrast(value);
  };

  return (
    <div className="absolute bottom-[5px] right-[980px] flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Adjustments</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          &times;
        </button>
      </div>
      
      <label className="flex flex-col mb-4">
        <span className="flex items-center mb-1 text-gray-700 dark:text-gray-300">
          <div className="mr-2">
            <FaSun />
          </div>
          Brightness:
        </span>
        <input
          type="range"
          min="0"
          max="200"
          value={localBrightness}
          onChange={handleBrightnessChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
        />
      </label>

      <label className="flex flex-col mb-4">
        <span className="flex items-center mb-1 text-gray-700 dark:text-gray-300">
          <div className="mr-2">
            <FaMoon />
          </div>
          Contrast:
        </span>
        <input
          type="range"
          min="0"
          max="200"
          value={localContrast}
          onChange={handleContrastChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
        />
      </label>
    </div>
  );
};

export default ImageAdjustmentMenu;