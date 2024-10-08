import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { COLORS, COLOR_IMAGES } from '../constants';
import BagSelector from './BagSelector';
import GameRulesModal from './GameRulesModal';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);

`;

const ContentWrapper = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  max-width: 1200px;
  width: 100%;
`;

const BagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const BagItem = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const BagImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  border: 3px solid ${props => props.color};
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
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const BlindBagGame = ({ onGameEnd }) => {
  const [bagCount, setBagCount] = useState(10);
  const [desiredColor, setDesiredColor] = useState(COLORS[0].name);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRoundBags, setCurrentRoundBags] = useState([]);
  const [showRules, setShowRules] = useState(true);
  const [roundCount, setRoundCount] = useState(0); // New state for round count
  const [setReceivedBags] = useState([]); // New state for receivedBags
  const bagGridRef = useRef(null);

  useEffect(() => {
    if (bagGridRef.current) {
      bagGridRef.current.scrollTop = bagGridRef.current.scrollHeight;
    }
  }, [currentRoundBags]);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
  
      const newBags = Array.from({ length: totalBags }, () => {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)].name;
        const images = COLOR_IMAGES[color];
        const image = images[Math.floor(Math.random() * images.length)];
        return { color, image };
      });
  
      allReceivedBags = [...allReceivedBags, ...newBags];
      setReceivedBags(allReceivedBags);

      // Display each bag one by one
      for (let i = 0; i < newBags.length; i++) {
        setCurrentRoundBags(prev => [...prev, newBags[i]]);
        await delay(850); // Wait 0.75 seconds per bag
      }

      const colorCounts = newBags.reduce((counts, bag) => {
        counts[bag.color] = (counts[bag.color] || 0) + 1;
        return counts;
      }, {});

      const matchedBags = [];
      const unmatchedBags = [];
      const pairedColors = [];
      const bonusBags = [];

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

      const desiredColorCount = newBags.filter(bag => bag.color === desiredColor).length;
      for (let i = 0; i < desiredColorCount; i++) {
        bonusBags.push(desiredColor);
      }

      const roundSummary = {
        pairedCount: pairedColors.length,
        desiredColorCount,
        bonusBagsCount: bonusBags.length
      };

      // Display round summary
      setCurrentRoundBags(prev => [...prev, roundSummary]);
      await delay(2500); // Wait 2.5 seconds to show summary

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

      if (bonusBags.length === 0) break;
    }

    setIsPlaying(false);
    onGameEnd({
      initialBags: bagCount,
      desiredColor: desiredColor,
      rounds: rounds,
      receivedBags: allReceivedBags,
    });
  };

  const handleStartGame = () => {
    setShowRules(false);
    setCurrentRoundBags([]);
    setRoundCount(0);
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
            <PlayButton
              onClick={playGame}
              disabled={isPlaying}
            >
              {isPlaying ? 'Đang chơi...' : 'Bắt đầu chơi'}
            </PlayButton>
            {isPlaying && <h2 className="text-2xl font-bold mt-4">Lượt: {roundCount}</h2>}
            <BagGrid>
              {currentRoundBags.map((bag, index) => (
                bag.pairedCount !== undefined ? (
                  <div key="summary" className="col-span-full text-center mt-4">
                    <h3 className="text-xl font-bold">Kết quả lượt {roundCount}</h3>
                    <p>Số cặp: {bag.pairedCount}</p>
                    <p>Số túi trùng màu nguyện vọng: {bag.desiredColorCount}</p>
                    <p>Tổng số túi được tặng: {bag.bonusBagsCount}</p>
                  </div>
                ) : (
                  <BagItem key={`${bag.color}-${index}`}>
                    <BagImage src={bag.image} alt={bag.color} color={bag.color} />
                    <p className="text-center mt-2 font-semibold">{bag.color}</p>
                  </BagItem>
                )
              ))}
            </BagGrid>
          </>
        )}
      </ContentWrapper>
    </GameContainer>
  );
};

export default BlindBagGame;