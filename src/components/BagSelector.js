import React from 'react';

const BagSelector = ({ bagCount, onBagCountChange, desiredColor, onDesiredColorChange, colors }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="bagCount" className="block text-sm font-medium text-gray-700">
          Số túi mù:
        </label>
        <input
          type="number"
          id="bagCount"
          value={bagCount}
          onChange={(e) => onBagCountChange(Math.min(100, Math.max(1, parseInt(e.target.value))))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="desiredColor" className="block text-sm font-medium text-gray-700">
          Màu nguyện vọng:
        </label>
        <select
          id="desiredColor"
          value={desiredColor}
          onChange={(e) => onDesiredColorChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          {colors.map((color) => (
            <option key={color.name} value={color.name}>
              {color.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BagSelector;