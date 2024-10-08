import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import StyledImage from './StyledImage';

const RevealContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
`;

const BagItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const BagColor = styled.p`
  font-size: 18px;
  color: #333;
  margin-top: 10px;
`;

const BagReveal = ({ bags, revealInterval = 1000 }) => {
  const [revealedBags, setRevealedBags] = useState([]);

  useEffect(() => {
    if (revealedBags.length < bags.length) {
      const timer = setTimeout(() => {
        setRevealedBags(prev => [...prev, bags[prev.length]]);
      }, revealInterval);
      return () => clearTimeout(timer);
    }
  }, [revealedBags, bags, revealInterval]);

  return (
    <RevealContainer>
      {revealedBags.map((bag, index) => (
        <BagItem key={index}>
          <StyledImage src={bag.image} alt={`Bag ${index + 1}`} />
          <BagColor>{bag.color}</BagColor>
        </BagItem>
      ))}
    </RevealContainer>
  );
};

export default BagReveal;