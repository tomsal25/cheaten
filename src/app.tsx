import { useState } from 'preact/hooks';
import './app.scss';
import { GameManager } from './components/GameManager';
import { DEBUG_SKIP_WELCOME_SCREEN } from './config/Debug';

const StartButton = ({ setStart }: { setStart: () => void }) => {
  return (
    <div>
      <button
        style={{
          fontSize: '3rem',
          padding: '1em 2em',
          background: '#eeee',
          borderRadius: '2em',
          boxShadow: '.2em .2em 0 .1em #ccc',
        }}
        onClick={setStart}
      >
        Let's Start!
      </button>
    </div>
  );
};

export const App = () => {
  const [isStart, setIsStart] = useState(false);

  if (DEBUG_SKIP_WELCOME_SCREEN) setIsStart(true);

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
