import React from 'react';
import { COLORS } from './BlindBagGame';
const GameResult = ({ result, onPlayAgain }) => {
  const totalBags = result.initialBags;
  const totalBonusBags = result.rounds.reduce((sum, round) => sum + round.bonusBags.length, 0);
  const finalBags = totalBags + totalBonusBags;

  const colorCounts = result.rounds.reduce((counts, round) => {
    round.newBags.concat(round.bonusBags).forEach(color => {
      counts[color] = (counts[color] || 0) + 1;
    });
    return counts;
  }, {});

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Kết quả trò chơi</h2>
      {result.reachedMaxRounds && (
        <p className="text-red-500 font-bold mb-2">Trò chơi đã đạt đến giới hạn tối đa 20 lượt!</p>
      )}
      <p>Số túi ban đầu: {result.initialBags}</p>
      <p>Màu nguyện vọng: {result.desiredColor}</p>
      <p>Tổng số túi nhận được: {finalBags} (Mua: {totalBags}, Được tặng: {totalBonusBags})</p>
      <button
        onClick={onPlayAgain}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Chơi lại
      </button>
      <h3 className="text-xl font-semibold mt-4 mb-2">Chi tiết các lượt:</h3>
      {result.rounds.map((round, index) => (
        <div key={index} className="mb-4 p-2 border rounded">
          <h4 className="font-semibold">Lượt {index + 1}:</h4>
          {index > 0 && (
  <p>
    Túi chưa bắt cặp: {round.remainingBags.map(color => {
      const colorObj = COLORS.find(c => c.name === color);
      return (
        <span key={color} className={`inline-block px-2 py-1 m-1 rounded ${colorObj.bgColor} ${colorObj.textColor}`}>
          {color}
        </span>
      );
    })}
  </p>
)}
          <p>Túi bốc ra: {round.newBags.map(color => {
  const colorObj = COLORS.find(c => c.name === color);
  return (
    <span key={color} className={`inline-block px-2 py-1 m-1 rounded ${colorObj.bgColor} ${colorObj.textColor}`}>
      {color}
    </span>
  );
})}
</p>
          <p>Số túi trùng màu nguyện vọng: {round.desiredColorCount}</p>
          <p>Số túi được ghép cặp: {round.pairedColors.length}</p>
          {round.pairedColors.length > 0 && <p>Cặp: {round.pairedColors.join(', ')}</p>}
          <p>Được tặng {round.bonusBags.length} túi.</p>
        </div>
      ))}

      <h3 className="text-xl font-semibold mt-4 mb-2">Tổng kết túi nhận được:</h3>
      <ul>
        {Object.entries(colorCounts).map(([color, count]) => (
          <li key={color}>{color}: {count}</li>
        ))}
      </ul>

      
    </div>
  );
};

export default GameResult;