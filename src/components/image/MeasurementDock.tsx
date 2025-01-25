import React from 'react';
import { BiRuler, BiCircle, BiSquare } from 'react-icons/bi';
import { FaRulerHorizontal, FaAngleRight } from 'react-icons/fa';
import { BsPencil } from 'react-icons/bs';

interface MeasurementDockProps {
  onToolSelect: (tool: string) => void;
  selectedTool: string | null;
  onClose: () => void;
}

const MeasurementDock: React.FC<MeasurementDockProps> = ({
  onToolSelect,
  selectedTool,
  onClose
}) => {
  const tools = [
    { id: 'line', icon: BiRuler, label: 'Line' },
    { id: 'circle', icon: BiCircle, label: 'Circle/Ellipse' },
    { id: 'angle', icon: FaAngleRight, label: 'Angle' },
    { id: 'roi', icon: BiSquare, label: 'ROI' },
    { id: 'distance', icon: FaRulerHorizontal, label: 'Distance' },
    { id: 'annotate', icon: BsPencil, label: 'Annotate' },
  ];

  return (
    <div className="absolute right-20 top-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border-2 border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Measurement Tools
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ×
        </button>
      </div>
      <div className="space-y-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-200
              ${selectedTool === tool.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            onClick={() => onToolSelect(tool.id)}
          >
            <tool.icon size={16} />
            <span className="text-sm">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MeasurementDock; 