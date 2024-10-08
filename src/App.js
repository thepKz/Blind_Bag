import React, { useState } from 'react';
import BlindBagGame from './components/BlindBagGame';
import GameResult from './components/GameResult';

function App() {
  const [gameResult, setGameResult] = useState(null);

  const handleGameEnd = (result) => {
    setGameResult(result);
  };

  const handlePlayAgain = () => {
    setGameResult(null);
  };

  return (
    <div>
      {gameResult ? (
        <GameResult result={gameResult} onPlayAgain={handlePlayAgain} />
      ) : (
        <BlindBagGame onGameEnd={handleGameEnd} />
      )}
    </div>
  );
}

export default App;