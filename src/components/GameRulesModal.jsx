import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: linear-gradient(45deg, #ff9a9e, #fad0c4, #ffecd2);
  border-radius: 15px;
  padding: 50px;
  max-width: 600px;
  margin: 100px auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: appear 0.8s ease-out;
  @keyframes appear {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const RulesList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const RuleItem = styled.li`
  margin-bottom: 10px;
  color: #444;
  font-size: 16px;
  display: flex;
  align-items: center;

  &:before {
    content: '✨';
    margin-right: 10px;
    font-size: 20px;
  }
`;

const StartButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border: none;
  color: white;
  padding: 12px 24px;
  font-size: 18px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 20px auto 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const GameRulesSection = ({ onStart }) => {
  return (
    <Container>
      <Title>Trò Chơi Túi Mù</Title>
      <RulesList>
        <RuleItem>Bạn chọn số túi mù sẽ mua và màu nguyện vọng.</RuleItem>
        <RuleItem>Hệ thống sẽ bốc ngẫu nhiên số túi mù như bạn đã chọn.</RuleItem>
        <RuleItem>Nếu có 2 túi cùng màu, bạn sẽ được tặng 1 túi mù.</RuleItem>
        <RuleItem>Nếu túi trúng với màu nguyện vọng, bạn cũng sẽ được tặng 1 túi mù.</RuleItem>
        <RuleItem>Những túi được tặng thêm sẽ tiếp tục bốc lại (2 lượt tiếp theo) và kiểm tra có trúng cặp hoặc trúng màu với màu còn lại.</RuleItem>
        <RuleItem>Trò chơi kết thúc khi không còn túi mù trúng màu hoặc nguyện vọng, hoặc đạt tối đa 20 lượt.</RuleItem>
      </RulesList>
      <StartButton onClick={onStart}>Đã Hiểu</StartButton>
    </Container>
  );
};

export default GameRulesSection;
