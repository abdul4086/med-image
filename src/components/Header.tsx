import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useThemeClass } from '../hooks/useThemeClass.ts';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { getPrimaryClass, getTextClass } = useThemeClass();

  return (
    <div className={`flex h-[52px] w-full ${getPrimaryClass()} pl-6 py-2.5`}>
      <div className={`text-white text-base font-medium`}>Med-Image</div>
      <div className="flex items-center justify-center h-fit w-fit gap-3 ml-auto mr-[52px]">
        <div 
          className={`text-white text-xs font-medium cursor-pointer`}
          onClick={() => toggleTheme(false)}
        >
          Light
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isDarkMode}
            onChange={() => toggleTheme()}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
        <div 
          className={`text-white text-xs font-medium cursor-pointer`}
          onClick={() => toggleTheme(true)}
        >
          Dark
        </div>
      </div>
    </div>
  );
};

export default Header;
