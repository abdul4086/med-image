import React from 'react';
import { BiCircle, BiPencil, BiRuler, BiSquare } from 'react-icons/bi';
import { FaAngleRight, FaRulerHorizontal } from 'react-icons/fa';

interface MeasurementToolsProps {
  onToolSelect: (tool: string) => void;
  selectedTool: string | null;
}

const MeasurementTools: React.FC<MeasurementToolsProps> = ({
  onToolSelect,
  selectedTool,
}) => {
  const tools = [
    { id: 'line', icon: BiRuler, label: 'Line Measurement' },
    { id: 'circle', icon: BiCircle, label: 'Circle/Ellipse' },
    { id: 'angle', icon: FaAngleRight, label: 'Angle Measurement' },
    { id: 'roi', icon: BiSquare, label: 'Region of Interest' },
    { id: 'annotate', icon: BiPencil, label: 'Annotate' },
    { id: 'distance', icon: FaRulerHorizontal, label: 'Distance' },
  ];

  return (
    <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Measurement Tools
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200
              ${selectedTool === tool.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            onClick={() => onToolSelect(tool.id)}
            title={tool.label}
          >
            <tool.icon size={20} />
            <span className="text-xs">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MeasurementTools; 