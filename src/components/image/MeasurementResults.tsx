import React from 'react';
import { BiTrash } from 'react-icons/bi';

interface MeasurementResult {
  id: string;
  type: string;
  value: string;
  timestamp: Date;
}

interface MeasurementResultsProps {
  measurements: MeasurementResult[];
  onDelete: (id: string) => void;
}

const MeasurementResults: React.FC<MeasurementResultsProps> = ({
  measurements,
  onDelete,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Measurement Results
      </h3>
      <div className="space-y-2">
        {measurements.map((measurement) => (
          <div
            key={measurement.id}
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
          >
            <div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {measurement.type}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {measurement.value}
              </span>
            </div>
            <button
              onClick={() => onDelete(measurement.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <BiTrash size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeasurementResults; 