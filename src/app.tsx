import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import './app.css';
import imgsrc from './assets/preact.svg';
import { GameManager } from './components/GameManager';
import { GAME_ID } from './config/Consts';

const useScreenSize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  // FIXME: check delay time
  const setLazySize = () => {
    window.setTimeout(() => {
      // setWidth(document.documentElement.clientWidth);
      // setHeight(document.documentElement.clientHeight);
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }, 100);
  };

  useEffect(() => {
    window.addEventListener('resize', setLazySize);
    return () => {
      window.removeEventListener('resize', setLazySize);
    };
  }, []);

  return { width, height };
};

const StartButton: FunctionComponent<{ setStart: () => void }> = ({
  setStart,
}) => {
  return <button onClick={setStart}>Let's Start!</button>;
};

export const App = () => {
  const [isStart, setIsStart] = useState(false);
  const { width, height } = useScreenSize();

  return (
    <>
      <div
        id={GAME_ID}
        style={{
          width: `${width * 0.95}px`,
          height: `${height * 0.8}px`,
          backgroundColor: 'gray',
          backgroundImage: `url('${imgsrc}')`,
        }}
      />
      {isStart ? (
        <GameManager />
      ) : (
        <StartButton setStart={() => setIsStart(true)} />
      )}
    </>
  );
};
