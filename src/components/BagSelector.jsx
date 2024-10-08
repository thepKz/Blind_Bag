import React from 'react';

const BagSelector = ({ bagCount, onBagCountChange, desiredColor, onDesiredColorChange, colors }) => {
  return (
    <div >
      <div>
        <label htmlFor="bagCount" className="block text-lg font-extrabold text-slate-950 mb-3 tracking-wide">
          Số túi mù:
        </label>
        <input
          type="number"
          id="bagCount"
          value={bagCount}
          onChange={(e) => onBagCountChange(Math.min(100, Math.max(1, parseInt(e.target.value))))}
          className="mt-1 block w-full rounded-lg border-2 border-indigo-300 bg-white bg-opacity-90 text-indigo-800 shadow-lg transition duration-300 ease-in-out focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-300 text-center text-xl font-bold"
          style={{ animation: 'pulse 2s infinite' }}
        />
      </div>
      <div>
        <label htmlFor="desiredColor" className="block text-lg font-extrabold text-slate-950 mb-3 tracking-wide">
          Màu nguyện vọng:
        </label>
        <select
          id="desiredColor"
          value={desiredColor}
          onChange={(e) => onDesiredColorChange(e.target.value)}
          className="mt-1 block w-full rounded-lg border-2 border-indigo-300 bg-white bg-opacity-90 text-indigo-800 shadow-lg transition duration-300 ease-in-out focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-300 text-center text-xl font-bold"
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
