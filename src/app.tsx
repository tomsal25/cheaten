import { useState } from 'preact/hooks';

import './app.css';
import { GameManager } from './components/GameManager';

const StartButton = ({ setStart }: { setStart: () => void }) => {
  return (
    <div>
      <button onClick={setStart}>Let's Start!</button>
    </div>
  );
};

export const App = () => {
  const [isStart, setIsStart] = useState(false);

  return (
    <>
      {isStart ? (
        <GameManager />
      ) : (
        <StartButton setStart={() => setIsStart(true)} />
      )}
    </>
  );
};
