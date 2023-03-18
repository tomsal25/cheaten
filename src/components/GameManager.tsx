import Phaser from 'phaser';
import { useEffect, useState } from 'preact/hooks';

import { useStore } from '@nanostores/preact';

import imgsrc from '../assets/preact.svg';
import { GAME_CONFIG, GAME_ID } from '../config/Consts';
import { DEBUG_ASSIGN_GAME_AS_GLOBAL } from '../config/Debug';
import { sceneList } from '../scenes';
import { g_count, g_currentSceneKey, g_isPlaying } from '../store/Store';
import { CodeEditor } from './CodeEditor';

const useScreenSize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    // FIXME: check delay time
    const setLazySize = () => {
      window.setTimeout(() => {
        // setWidth(document.documentElement.clientWidth);
        // setHeight(document.documentElement.clientHeight);
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }, 100);
    };
    window.addEventListener('resize', setLazySize);
    return () => {
      window.removeEventListener('resize', setLazySize);
    };
  }, []);

  return { width, height };
};

const Buttons = ({ text }: { text: string }) => {
  const Flag = ({ text }: { text: string }) => {
  const flag = useStore(g_isPlaying);
  const handler = () => {
    text == '123' && g_isPlaying.set(!flag);
    };
    return <button onClick={handler}>{flag ? 'playing' : 'paused'}</button>;
  };

  const Count = () => {
    const atmCnt = useStore(g_count);
    if (atmCnt % 2 == 1) g_currentScreen.set('editor');
    else g_currentScreen.set('game');
    return <button onClick={() => g_count.set(atmCnt + 1)}>{atmCnt}</button>;
  };

  return (
    <>
      <Flag text={text} />
      <Count />
    </>
  );
};

const Editor = ({
  text,
  setText,
}: {
  text: string;
  setText: (str: string) => void;
}) => {
  const isSelectEditor = useStore(g_currentScreen) == 'editor';

  return (
    <CodeEditor
      text={text}
      setText={str => setText(str)}
      style={{
        position: 'absolute',
        left: '50%',
        width: '100%',
        maxWidth: '500px',
        height: '100%',
        zIndex: 0,
        ...(isSelectEditor
          ? {
              transform: 'translate(-50%, 0%)',
              transition: 'transform 1500ms ease',
            }
          : {
              transform: 'translate(-50%, 0%) scale(0)',
              transition: 'transform 1000ms ease',
            }),
      }}
    />
  );
};

export const GameManager = () => {
  const [text, setText] = useState('123');
  const { width, height } = useScreenSize();

  useEffect(() => {
    const _game = new Phaser.Game({ ...GAME_CONFIG, scene: sceneList });
    if (DEBUG_ASSIGN_GAME_AS_GLOBAL) {
      // @ts-expect-error 2339
      window.game = _game;
    }

    const unsubscriberList = [
      g_isPlaying.listen(isPlaying => {
        const currentScene = g_currentSceneKey.get();
        if (!currentScene) return;
        isPlaying
          ? _game.scene.resume(currentScene)
          : _game.scene.pause(currentScene);
      }),
    ];

    return () => {
      unsubscriberList.forEach(fn => fn());
      _game.destroy(true);
    };
  }, []);

  return (
    <>
      <div
        id={GAME_ID}
        style={{
          position: 'relative',
          width: `${width * 0.95}px`,
          height: `${height * 0.8}px`,
          backgroundColor: 'gray',
          backgroundImage: `url('${imgsrc}')`,
        }}
      >
        <Editor text={text} setText={setText} />
        {/* canvas will be inserted here */}
      </div>

      <Buttons text={text} />
    </>
  );
};
