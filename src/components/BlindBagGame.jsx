// Import các thư viện và component cần thiết
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { COLORS, COLOR_IMAGES } from '../constants';
import BagSelector from './BagSelector';
import GameRulesModal from './GameRulesModal';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
// Định nghĩa các styled components cho giao diện trò chơi
const GameContainer = styled.div`
  background: linear-gradient(135deg, #ffd3e3 0%, #fff0c1 100%);
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  width: 1500px;
  min-height: 100vh;
  animation: ${fadeIn} 1s ease-out;
  
  @media (min-width: 768px) {
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 20px;
    width: 95%;
  }
`;

const BagGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
  max-height: 50vh;
  overflow-y: auto;
  padding-right: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const BagItem = styled(motion.div)`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 3px solid ${props => props.color};
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const BagImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    height: 100px;
  }
`;

const PlayButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    background: linear-gradient(45deg, #ff8787, #ffd783);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px 20px;
  }
`;

// Component chính của trò chơi Blind Bag
const BlindBagGame = ({ onGameEnd }) => {
  // Khai báo các state cần thiết cho trò chơi
  const [bagCount, setBagCount] = useState(10);
  const [desiredColor, setDesiredColor] = useState(COLORS[0].name);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRoundBags, setCurrentRoundBags] = useState([]);
  const [showRules, setShowRules] = useState(true);
  const [roundCount, setRoundCount] = useState(0);
  const [receivedBags, setReceivedBags] = useState([]);
  const bagGridRef = useRef(null);

  // Effect để cuộn xuống cuối danh sách túi khi có túi mới
  useEffect(() => {
    if (bagGridRef.current) {
      bagGridRef.current.scrollTo({
        top: bagGridRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentRoundBags]);

  // Hàm tạo độ trễ
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Hàm chính để chơi trò chơi
  const playGame = async () => {
    setIsPlaying(true);
    setCurrentRoundBags([]);
    let totalBags = bagCount;
    let rounds = [];
    let allReceivedBags = [];
    setRoundCount(0);
    
    while (totalBags > 0) {
      const currentRound = roundCount + 1;
      await delay(2500);
      setRoundCount(currentRound);
      setCurrentRoundBags([]);
  
      // Tạo các túi mới cho lượt hiện tại
      const newBags = Array.from({ length: totalBags }, () => {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)].name;
        const images = COLOR_IMAGES[color];
        const image = images[Math.floor(Math.random() * images.length)];
        return { color, image };
      });
  
      allReceivedBags = [...allReceivedBags, ...newBags];
      setReceivedBags(allReceivedBags);

      // Hiển thị từng túi một
      for (let i = 0; i < newBags.length; i++) {
        setCurrentRoundBags(prev => [...prev, newBags[i]]);
        await delay(150); // Đợi 0.15 giây cho mỗi túi
      }

      // Đếm số lượng túi cho mỗi màu
      const colorCounts = newBags.reduce((counts, bag) => {
        counts[bag.color] = (counts[bag.color] || 0) + 1;
        return counts;
      }, {});

      const matchedBags = [];
      const unmatchedBags = [];
      const pairedColors = [];
      const bonusBags = [];

      // Xử lý các cặp túi và túi thưởng
      Object.entries(colorCounts).forEach(([color, count]) => {
        const pairs = Math.floor(count / 2);
        if (pairs > 0) {
          for (let i = 0; i < pairs; i++) {
            matchedBags.push(color, color);
            bonusBags.push(color);
            pairedColors.push(color);
          }
        }
        const remainingCount = count % 2;
        for (let i = 0; i < remainingCount; i++) {
          unmatchedBags.push(color);
        }
      });

      // Xử lý túi trùng màu nguyện vọng
      const desiredColorCount = newBags.filter(bag => bag.color === desiredColor).length;
      for (let i = 0; i < desiredColorCount; i++) {
        bonusBags.push(desiredColor);
      }

      // Tạo tổng kết cho lượt hiện tại
      const roundSummary = {
        pairedCount: pairedColors.length,
        desiredColorCount,
        bonusBagsCount: bonusBags.length
      };

      // Hiển thị tổng kết lượt
      setCurrentRoundBags(prev => [...prev, roundSummary]);
      await delay(2500); // Đợi 2.5 giây để hiển thị tổng kết

      // Lưu thông tin lượt chơi
      rounds.push({
        totalBags,
        newBags,
        matchedBags,
        unmatchedBags,
        bonusBags,
        pairedColors,
        desiredColorCount
      });

      totalBags = bonusBags.length;

      // Kết thúc trò chơi nếu không còn túi thưởng
      if (bonusBags.length === 0) break;
    }

    // Kết thúc trò chơi và gửi kết quả
    setIsPlaying(false);
    onGameEnd({
      initialBags: bagCount,
      desiredColor: desiredColor,
      rounds: rounds,
      receivedBags: allReceivedBags,
    });
  };

  // Hàm xử lý khi bắt đầu trò chơi
  const handleStartGame = () => {
    setShowRules(false);
    setCurrentRoundBags([]);
    setRoundCount(0);
  };

  // Render giao diện trò chơi
  return (
    <GameContainer>
      <ContentWrapper>
        {showRules ? (
          <GameRulesModal onStart={handleStartGame} />
        ) : (
          <>
            <BagSelector
              bagCount={bagCount}
              onBagCountChange={setBagCount}
              desiredColor={desiredColor}
              onDesiredColorChange={setDesiredColor}
              colors={COLORS}
            />
            <PlayButton
              onClick={playGame}
              disabled={isPlaying}
            >
              {isPlaying ? 'Đang chơi...' : 'Bắt đầu chơi'}
            </PlayButton>
            {isPlaying && <h2 className="text-2xl font-bold mt-4">Lượt: {roundCount}</h2>}
            <BagGrid ref={bagGridRef}>
              <AnimatePresence>
                {currentRoundBags.map((bag, index) => (
                  bag.pairedCount !== undefined ? (
                    <motion.div
                      key="summary"
                      className="col-span-full text-center mt-4"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-xl font-bold">Kết quả lượt {roundCount}</h3>
                      <p>Số cặp: {bag.pairedCount}</p>
                      <p>Số túi trùng màu nguyện vọng: {bag.desiredColorCount}</p>
                      <p>Tổng số túi được tặng: {bag.bonusBagsCount}</p>
                    </motion.div>
                  ) : (
                    <BagItem
                      key={`${bag.color}-${index}`}
                      color={bag.color}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BagImage src={bag.image} alt={bag.color} />
                      <p className="text-center mt-2 font-semibold">{bag.color}</p>
                    </BagItem>
                  )
                ))}
              </AnimatePresence>
            </BagGrid>
          </>
        )}
      </ContentWrapper>
    </GameContainer>
  );
};

export default BlindBagGame;