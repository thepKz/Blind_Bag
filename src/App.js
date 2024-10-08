import React, { useState } from 'react';
import BlindBagGame from './components/BlindBagGame';
import GameResult from './components/GameResult';

function App() {
  const [gameResult, setGameResult] = useState(null);

  const handleGameEnd = (result) => {
    setGameResult(result);
  };

  return (
    <div className="App min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Trò Chơi Túi Mù</h1>
        {gameResult ? (
          <GameResult result={gameResult} onPlayAgain={() => setGameResult(null)} />
        ) : (
          <BlindBagGame onGameEnd={handleGameEnd} />
        )}
      </div>
    </div>
  );
}

export default App;