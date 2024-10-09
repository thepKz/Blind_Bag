import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ResultContainer = styled(motion.div)`
  background: linear-gradient(135deg, #ffd3e3 0%, #fff0c1 100%);
  padding: 0.5rem;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  min-height: 100vh;
  animation: ${fadeIn} 1s ease-out;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  color: #ff7675;
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Arial', sans-serif;
  letter-spacing: 1px;

  @media (min-width: 480px) {
    font-size: 1.5rem;
  }

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const CongratsTitle = styled(Title)`
  color: #ff7675;
  font-size: 1.2rem;
  margin-top: 0.5rem;

  @media (min-width: 480px) {
    font-size: 1.5rem;
  }
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #444;
  margin-bottom: 0.5rem;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  font-family: 'Verdana', sans-serif;
  line-height: 1.2;

  @media (min-width: 480px) {
    font-size: 1.2rem;
  }

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const BagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const BagItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px) rotate(3deg);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

const BagImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 0.5rem;

  @media (min-width: 480px) {
    height: 120px;
  }

  @media (min-width: 768px) {
    height: 160px;
  }
`;

const PlayAgainButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff7675, #f7d794);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 1.5rem auto 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    background: linear-gradient(45deg, #ff9f9f, #ffeaa7);
    filter: brightness(1.1);
  }

  @media (min-width: 480px) {
    font-size: 1.2rem;
    padding: 1rem 2rem;
    margin: 2rem auto 0;
  }
`;

const GameResult = ({ result, onPlayAgain }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    for (let i = 0; i < 5; i++) {
      confetti({
        particleCount: 150,
        spread: 150,
        angle: Math.random() * 60 + 40,
        origin: { y: 0.6, x: Math.random() * 0.4 + 0.3 },
      });
    }
  }, []);

  const totalReceivedBags =
    (result.receivedBags?.length || 0) + (result.unmatchedBags?.length || 0);
  const allBags = [...(result.receivedBags || []), ...(result.unmatchedBags || [])];

  return (
    <ResultContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Kết quả trò chơi</Title>
      <InfoText>Số túi ban đầu: {result.initialBags}</InfoText>
      <InfoText>
        Màu nguyện vọng: <span style={{ color: result.desiredColor }}>{result.desiredColor}</span>
      </InfoText>
        
      <InfoText>Tổng số túi nhận được: {totalReceivedBags}</InfoText>

      <PlayAgainButton
        onClick={onPlayAgain}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Chơi lại
      </PlayAgainButton>

      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <CongratsTitle>Chúc mừng bạn đã nhận được:</CongratsTitle>
          </motion.div>
        )}
      </AnimatePresence>

      {allBags.length > 0 && (
        <>
          <InfoText style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Tất cả các túi:</InfoText>
          <BagGrid>
            {allBags.map((bag, index) => (
              <BagItem
                key={`bag-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BagImage
                  src={bag.image}
                  alt={bag.color}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'path/to/fallback/image.png';
                  }}
                />
                <p style={{ color: bag.color, fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {bag.color}
                </p>
              </BagItem>
            ))}
          </BagGrid>
        </>
      )}

    </ResultContainer>
  );
};

export default GameResult;
