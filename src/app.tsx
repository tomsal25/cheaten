import Phaser from 'phaser';
import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import './app.css';
import imgsrc from './assets/preact.svg';
import { GameManager } from './components/GameManager';
import { GAME_CONFIG, GAME_ID } from './config/Consts';
import { Ex } from './scenes/Ex';
import { Stage1 } from './scenes/Stage1';
import { Stage2 } from './scenes/Stage2';
import { Title } from './scenes/Title';

const scene = [Title, Stage1, Ex, Stage2];

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
  const [game, setGame] = useState<Phaser.Game | null>(null);
  if (import.meta.env.DEV) {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.game = game;
  }
  const [isStart, setIsStart] = useState(false);

  const { width, height } = useScreenSize();

  useEffect(() => {
    if (!isStart) return;
    // setGame(_g => _g ?? new Phaser.Game({ ...GAME_CONFIG, scene }));
    setGame(_g => {
      const gg = _g ?? new Phaser.Game({ ...GAME_CONFIG, scene });
      return gg;
    });
  }, [isStart]);

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
      {game ? (
        <GameManager game={game} />
      ) : (
        <StartButton setStart={() => setIsStart(true)} />
      )}
    </>
  );
};
