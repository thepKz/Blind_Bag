import React from 'react';

const GameResult = ({ result, onPlayAgain }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Kết quả trò chơi</h2>
      <p>Số túi ban đầu: {result.initialBags}</p>
      <p>Màu nguyện vọng: {result.desiredColor}</p>
      <p>Tổng số túi nhận được: {result.receivedBags ? result.receivedBags.length : 0}</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Các túi nhận được:</h3>
      <div className="flex flex-wrap gap-2">
        {result.receivedBags && result.receivedBags.map((bag, index) => (
          <div key={index} className="text-center">
            <img
              src={bag.image}
              alt={bag.color}
              className="w-48 h-48 object-cover rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'path/to/fallback/image.png';
                console.log(`Failed to load image for ${bag.color} bag`);
              }}
            />
            <p className="mt-1 text-sm">{bag.color}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onPlayAgain}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Chơi lại
      </button>
    </div>
  );
};

export default GameResult;