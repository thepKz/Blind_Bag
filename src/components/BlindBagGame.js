import React, { useState } from 'react';
import BagSelector from './BagSelector';

export const COLORS = [
  { name: 'Đỏ', bgColor: 'bg-red-500', textColor: 'text-white' },
  { name: 'Xanh dương', bgColor: 'bg-blue-500', textColor: 'text-white' },
  { name: 'Xanh lá', bgColor: 'bg-green-500', textColor: 'text-white' },
  { name: 'Vàng', bgColor: 'bg-yellow-400', textColor: 'text-black' },
  { name: 'Cam', bgColor: 'bg-orange-500', textColor: 'text-white' },
  { name: 'Tím', bgColor: 'bg-purple-500', textColor: 'text-white' },
  { name: 'Hồng', bgColor: 'bg-pink-500', textColor: 'text-white' },
  { name: 'Nâu', bgColor: 'bg-amber-700', textColor: 'text-white' },
  { name: 'Đen', bgColor: 'bg-gray-800', textColor: 'text-white' },
  { name: 'Trắng', bgColor: 'bg-gray-200', textColor: 'text-black' },
];

const BlindBagGame = ({ onGameEnd }) => {
  const MAX_ROUNDS = 20;
  const [bagCount, setBagCount] = useState(10);
  const [desiredColor, setDesiredColor] = useState(COLORS[0].name);
  const [isPlaying, setIsPlaying] = useState(false);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const playGame = async () => {
    setIsPlaying(true);
    let totalBags = bagCount;
    let rounds = [];
    let remainingBags = [];
    let roundCount = 0;
  
    while (totalBags > 0 && roundCount < MAX_ROUNDS) {
      await delay(50);
  
      // Bốc túi mù
      const newBags = Array.from({ length: totalBags }, () => COLORS[Math.floor(Math.random() * COLORS.length)].name);
      const currentRound = [...remainingBags, ...newBags];
  
      // Kiểm tra kết quả
      const colorCounts = {};
      const matchedBags = [];
      const unmatchedBags = [];
      const bonusBags = [];
      const pairedColors = [];
  
      currentRound.forEach(color => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      });
  
      Object.entries(colorCounts).forEach(([color, count]) => {
        const pairs = Math.floor(count / 2);
        if (color !== desiredColor && pairs > 0) { // Exclude desired color from pairing
          for (let i = 0; i < pairs; i++) {
            matchedBags.push(color, color);
            bonusBags.push(color);
            pairedColors.push(color);
          }
        }
        const remainingCount = count % 2;
        if (color !== desiredColor) { // Exclude desired color from unmatched bags
          for (let i = 0; i < remainingCount; i++) {
            unmatchedBags.push(color);
          }
        }
        if (color === desiredColor) {
          const desiredColorBonus = count; // Count all desired color bags for bonus
          for (let i = 0; i < desiredColorBonus; i++) {
            bonusBags.push(color);
          }
        }
      });
  
      // Process bonus bags
      const bonusBagColors = bonusBags.map(() => COLORS[Math.floor(Math.random() * COLORS.length)].name);
  
      const desiredColorCount = currentRound.filter(color => color === desiredColor).length;
  
      rounds.push({
        totalBags,
        newBags,
        remainingBags,
        matchedBags,
        unmatchedBags,
        bonusBags: bonusBagColors,
        pairedColors,
        desiredColorCount
      });
  
      remainingBags = unmatchedBags;
      totalBags = bonusBagColors.length;
      roundCount++;
  
      // Dừng nếu không còn túi nào được tặng
      if (bonusBagColors.length === 0) break;
    }
  
    setIsPlaying(false);
    onGameEnd({
      initialBags: bagCount,
      desiredColor: desiredColor,
      rounds: rounds,
      reachedMaxRounds: roundCount === MAX_ROUNDS
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Luật chơi:</h2>
      <ul className="list-disc list-inside mb-4 text-sm">
        <li>Bạn chọn số túi mù sẽ mua và màu nguyện vọng.</li>
        <li>Shop "Minthep" sẽ bốc số túi mù như bạn đã chọn và bỏ vào giỏ đựng.</li>
        <li>Nếu có 2 túi cùng màu, bạn sẽ được tặng 1 túi mù.</li>
        <li>Nếu túi trùng với màu nguyện vọng, bạn cũng sẽ được tặng 1 túi mù.</li>
        <li>Những túi được tặng thêm sẽ tiếp tục bốc lại (ở lượt tiếp theo) và kiểm tra có trùng cặp hoặc trùng màu với màu còn lại ở trong giỏ đựng.</li>
        <li>Trò chơi kết thúc khi không còn túi mù trùng màu hoặc nguyện vọng, hoặc đạt tối đa {MAX_ROUNDS} lượt.</li>
      </ul>
      <BagSelector
        bagCount={bagCount}
        onBagCountChange={setBagCount}
        desiredColor={desiredColor}
        onDesiredColorChange={setDesiredColor}
        colors={COLORS}
      />
      <button
        onClick={playGame}
        disabled={isPlaying}
        className={`mt-4 ${isPlaying ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded`}
      >
        {isPlaying ? 'Đang chơi...' : 'Bắt đầu chơi'}
      </button>
    </div>
  );
};

export default BlindBagGame;