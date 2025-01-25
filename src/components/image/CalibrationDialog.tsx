import React, { useState } from 'react';

interface CalibrationDialogProps {
  onCalibrate: (knownDistance: number) => void;
  onCancel: () => void;
}

const CalibrationDialog: React.FC<CalibrationDialogProps> = ({
  onCalibrate,
  onCancel
}) => {
  const [knownDistance, setKnownDistance] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Calibrate Measurement</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Enter the known distance in millimeters for the line you just drew:
        </p>
        <input
          type="number"
          value={knownDistance}
          onChange={(e) => setKnownDistance(e.target.value)}
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600"
          placeholder="Distance in mm"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onCalibrate(Number(knownDistance))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!knownDistance}
          >
            Calibrate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalibrationDialog; 