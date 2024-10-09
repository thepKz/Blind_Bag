/* eslint-disable no-unused-vars */
// Import các thư viện và component cần thiết
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import styled, { css, keyframes } from 'styled-components';
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
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  animation: ${fadeIn} 1s ease-out;

  @media (min-width: 768px) {
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 15px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 10px;
    width: 95%;
  }
`;

const BagGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 20px;
  max-height: 40vh;
  overflow-y: auto;
  padding-right: 5px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }

  &::-webkit-scrollbar {
    width: 6px;
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
  border-radius: 10px;
  padding: 10px;
  border: 3px solid ${(props) => props.color};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  ${(props) =>
    props.isMatched &&
    css`
      border: 3px solid ${props.matchColor};
      animation: pulse 1s infinite;
    `}

  ${(props) =>
    props.isDesiredColor &&
    css`
      border: 3px solid blue;
      animation: pulseBlue 1s infinite;
    `}

  @keyframes pulse {
    0% {
      box-shadow: 0 0 5px ${(props) => props.matchColor};
    }
    50% {
      box-shadow: 0 0 15px ${(props) => props.matchColor};
    }
    100% {
      box-shadow: 0 0 5px ${(props) => props.matchColor};
    }
  }

  @keyframes pulseBlue {
    0% {
      box-shadow: 0 0 5px blue;
    }
    50% {
      box-shadow: 0 0 15px blue;
    }
    100% {
      box-shadow: 0 0 5px blue;
    }
  }
`;

const BagImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PlayButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(50, 50, 93, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.08);
    background: linear-gradient(45deg, #ff8787, #ffd783);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const UnmatchedSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
`;

const TimerBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden;
`;

const TimerProgress = styled.div`
  height: 100%;
  background-color: #4caf50;
  width: ${(props) => props.progress}%;
  transition: width 0.1s linear;
`;

const MatchedInfo = styled.div`
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #ff6b6b;
`;

// Component chính của trò chơi Blind Bag
const BlindBagGame = ({ onGameEnd }) => {
  const [bagCount, setBagCount] = useState(10);
  const [desiredColor, setDesiredColor] = useState(COLORS[0].name);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRoundBags, setCurrentRoundBags] = useState([]);
  const [showRules, setShowRules] = useState(true);
  const [roundCount, setRoundCount] = useState(0);
  const [receivedBags, setReceivedBags] = useState([]);
  const [unmatchedBags, setUnmatchedBags] = useState([]);
  const [matchedBags, setMatchedBags] = useState([]);
  const [desiredColorMatchedBags, setDesiredColorMatchedBags] = useState([]);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [desiredColorCount, setDesiredColorCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timerProgress, setTimerProgress] = useState(100);
  const bagGridRef = useRef(null);

  const [matchColors, setMatchColors] = useState({});
  let nextUnmatchedBags = [];

  useEffect(() => {
    if (bagGridRef.current) {
      bagGridRef.current.scrollTo({
        top: bagGridRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentRoundBags]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Hàm trợ giúp tìm các túi ghép cặp
  const findMatchesInBags = (bags) => {
    const matched = [];
    const colorGroups = {};

    bags.forEach((bag) => {
      if (bag.color !== desiredColor) {
        if (!colorGroups[bag.color]) {
          colorGroups[bag.color] = [];
        }
        colorGroups[bag.color].push(bag);
      }
    });

    Object.keys(colorGroups).forEach((color) => {
      const bagsOfColor = colorGroups[color];
      const pairs = Math.floor(bagsOfColor.length / 2);
      if (pairs > 0) {
        matched.push(...bagsOfColor.slice(0, pairs * 2));
      }
    });

    return matched;
  };

  const playGame = async () => {
    setIsPlaying(true);
    setCurrentRoundBags([]);
    setReceivedBags([]);
    setUnmatchedBags([]);
    setMatchedBags([]);
    setDesiredColorMatchedBags([]);
    setMatchedPairsCount(0);
    setDesiredColorCount(0);
    setMatchColors({});
    let totalBags = bagCount;
    let allReceivedBags = [];
    let currentUnmatchedBags = [];
    nextUnmatchedBags = [];

    while (totalBags > 0) {
      // Cập nhật unmatchedBags ở đầu mỗi lượt
      setUnmatchedBags(currentUnmatchedBags);

      const currentRound = roundCount + 1;
      setRoundCount((prevCount) => prevCount + 1);
      setCurrentRoundBags([]);
      setMatchedPairsCount(0);
      setDesiredColorCount(0);
      setShowConfetti(false);
      setMatchColors({});

      // Bốc túi mới cho lượt hiện tại
      const newBags = Array.from({ length: totalBags }, () => {
        const color =
          COLORS[Math.floor(Math.random() * COLORS.length)].name;
        const images = COLOR_IMAGES[color];
        const image = images[Math.floor(Math.random() * images.length)];
        return { color, image };
      });

      // Hiển thị từng túi mới với độ trễ và thanh thời gian
      for (let i = 0; i < newBags.length; i++) {
        setTimerProgress(100);
        const startTime = Date.now();
        const duration = 800;

        while (Date.now() - startTime < duration) {
          const elapsed = Date.now() - startTime;
          const progress = 100 - (elapsed / duration) * 100;
          setTimerProgress(progress);
          await delay(50);
        }

        setCurrentRoundBags((prev) => [...prev, newBags[i]]);
        await delay(100);
      }

      // Tìm túi trùng màu nguyện vọng trong túi mới
      const desiredColorBagsThisRound = newBags.filter(
        (bag) => bag.color === desiredColor
      );

      // Thêm hiệu ứng cho các túi trùng màu nguyện vọng
      setDesiredColorMatchedBags((prev) => [
        ...prev,
        ...desiredColorBagsThisRound,
      ]);
      setDesiredColorCount(desiredColorBagsThisRound.length);

      // Chờ để hiển thị hiệu ứng
      await delay(100);

      // Loại bỏ túi trùng màu nguyện vọng khỏi quá trình ghép cặp
      const nonDesiredColorNewBags = newBags.filter(
        (bag) => bag.color !== desiredColor
      );

      // Kết hợp túi chưa ghép từ lượt trước và túi mới (không bao gồm màu nguyện vọng)
      const combinedBags = [...currentUnmatchedBags, ...nonDesiredColorNewBags];

      // Tìm các cặp ghép trong combinedBags
      const matchedBagsThisRound = findMatchesInBags(combinedBags);

      // Gán màu sắc cho các cặp ghép để phân biệt
      const uniqueColors = ['gold', 'purple', 'green', 'orange', 'red'];
      let colorIndex = 0;
      const newMatchColors = {};

      for (let i = 0; i < matchedBagsThisRound.length; i += 2) {
        const matchColor = uniqueColors[colorIndex % uniqueColors.length];
        newMatchColors[matchedBagsThisRound[i]] = matchColor;
        newMatchColors[matchedBagsThisRound[i + 1]] = matchColor;
        colorIndex++;
      }

      setMatchColors((prev) => ({ ...prev, ...newMatchColors }));

      // Cập nhật số cặp đã ghép
      const totalMatchedPairs = matchedBagsThisRound.length / 2;
      setMatchedPairsCount(totalMatchedPairs);

      // Hiển thị pháo hoa nếu có cặp ghép
      if (totalMatchedPairs > 0) {
        setShowConfetti(true);
      }

      // Chờ để hiển thị hiệu ứng
      await delay(1000);

      // Loại bỏ các túi đã ghép khỏi combinedBags để tạo nextUnmatchedBags
      const matchedBagSet = new Set(matchedBagsThisRound);
      nextUnmatchedBags = combinedBags.filter(
        (bag) => !matchedBagSet.has(bag)
      );

      // Cập nhật các túi đã ghép
      setMatchedBags((prev) => [...prev, ...matchedBagsThisRound]);

      // Cập nhật các túi nhận được
      allReceivedBags = [
        ...allReceivedBags,
        ...matchedBagsThisRound,
        ...desiredColorBagsThisRound,
      ];
      setReceivedBags(allReceivedBags);

      // Tính toán số túi được tặng thêm cho lượt tiếp theo
      const numberOfPairs = totalMatchedPairs;
      const numberOfDesiredColorBags = desiredColorBagsThisRound.length;

      const totalBonusBags = numberOfPairs + numberOfDesiredColorBags;

      if (totalBonusBags === 0) {
        break;
      }

      totalBags = totalBonusBags;
      currentUnmatchedBags = nextUnmatchedBags;

      await delay(5000);
    }

    // Cập nhật unmatchedBags lần cuối
    setUnmatchedBags(currentUnmatchedBags);

    // Kết thúc trò chơi
    setIsPlaying(false);
    onGameEnd({
      initialBags: bagCount,
      desiredColor: desiredColor,
      receivedBags: allReceivedBags,
      unmatchedBags: currentUnmatchedBags,
    });
  };

  const handleStartGame = () => {
    setShowRules(false);
    setCurrentRoundBags([]);
    setRoundCount(0);
    setReceivedBags([]);
    setUnmatchedBags([]);
    setMatchedBags([]);
    setDesiredColorMatchedBags([]);
    setMatchedPairsCount(0);
    setDesiredColorCount(0);
    setShowConfetti(false);
    setMatchColors({});
  };

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
            <PlayButton onClick={playGame} disabled={isPlaying}>
              {isPlaying ? 'Đang chơi...' : 'Bắt đầu chơi'}
            </PlayButton>
            {isPlaying && (
              <>
                <h2 className="text-2xl font-bold mt-4">Lượt: {roundCount}</h2>
                <TimerBar>
                  <TimerProgress progress={timerProgress} />
                </TimerBar>
                <MatchedInfo>
                  Bạn nhận được {desiredColorCount} túi màu nguyện vọng!
                </MatchedInfo>
                <MatchedInfo>
                  Bạn đã ghép được {matchedPairsCount} cặp!
                </MatchedInfo>
              </>
            )}

            {showConfetti && <Confetti />}

            <BagGrid ref={bagGridRef}>
              <AnimatePresence>
                {currentRoundBags.map((bag, index) => (
                  <BagItem
                    key={`${bag.color}-${index}`}
                    color={bag.color}
                    isMatched={matchedBags.includes(bag)}
                    isDesiredColor={desiredColorMatchedBags.includes(bag)}
                    matchColor={matchColors[bag]}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BagImage src={bag.image} alt={bag.color} />
                    <p className="text-center mt-2 font-semibold">{bag.color}</p>
                  </BagItem>
                ))}
              </AnimatePresence>
            </BagGrid>

            {unmatchedBags.length > 0 && (
              <UnmatchedSection>
                <h3 className="text-xl font-bold">Túi chưa được ghép cặp</h3>
                <BagGrid>
                  {unmatchedBags.map((bag, index) => (
                    <BagItem
                      key={`${bag.color}-unmatched-${index}`}
                      color={bag.color}
                      isMatched={matchedBags.includes(bag)}
                      isDesiredColor={bag.color === desiredColor}
                      matchColor={matchColors[bag]}
                    >
                      <BagImage src={bag.image} alt={bag.color} />
                      <p className="text-center mt-2 font-semibold">
                        {bag.color}
                      </p>
                    </BagItem>
                  ))}
                </BagGrid>
              </UnmatchedSection>
            )}
          </>
        )}
      </ContentWrapper>
    </GameContainer>
  );
};

export default BlindBagGame;
