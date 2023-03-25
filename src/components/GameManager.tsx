import Phaser from 'phaser';
import { useEffect, useState } from 'preact/hooks';

import { useStore } from '@nanostores/preact';

import imgsrc from '../assets/preact.svg';
import { GAME_CONFIG, GAME_ID } from '../config/Consts';
import {
  DEBUG_ASSIGN_GAME_AS_GLOBAL,
  DEBUG_CHECK_ISMOVE,
  DEBUG_g_isMove,
} from '../config/Debug';
import { sceneList } from '../scenes';
import {
  g_currentSceneKey,
  g_currentScreen,
  g_flag,
  g_isPlaying,
  g_naviState,
  g_nextText,
  stepTimeline,
} from '../store/Store';
import { CodeEditor } from './CodeEditor';
import { DialogWindow } from './DialogWindow';
import { NavigationRobot } from './NavigationRobot';

const _checkMove = () => {
  const isMove = useStore(DEBUG_g_isMove);
  const flag = useStore(g_flag);

  return (
    <button>
      {isMove ? 'moving' : 'paused'}
      <br />
      {`flag${flag}`}
    </button>
  );
};
const Buttons = () => {
  const Flag = () => {
    const flag = useStore(g_isPlaying);
    const handler = () => {
      g_isPlaying.set(!flag);
    };
    return <button onClick={handler}>{flag ? 'playing' : 'paused'}</button>;
  };

  const ScreenChanger = () => {
    const currentScreen = useStore(g_currentScreen);

    return currentScreen == 'init' ? null : (
      <button
        onClick={() =>
          currentScreen == 'game'
            ? g_currentScreen.set('editor')
            : g_currentScreen.set('game')
        }
      >
        {currentScreen}
      </button>
    );
  };

  return (
    <div>
      <Flag />
      <ScreenChanger />
      {DEBUG_CHECK_ISMOVE && <_checkMove />}
    </div>
  );
};

const Navigator = ({ zIndex }: { zIndex: number }) => {
  const [isStartNavi, setIsStartNavi] = useState(false);
  const naviState = useStore(g_naviState);

  const Dialog = () => {
    const [isFinishedText, setIsFinishedText] = useState(false);
    const nextText = useStore(g_nextText);

    // check if finished reading
    useEffect(() => {
      if (naviState == 2 && isFinishedText) {
        setIsFinishedText(false);
        stepTimeline();
      }
    }, [isFinishedText]);

    return !isFinishedText && nextText ? (
      <DialogWindow
        name="Robot"
        text={nextText}
        setFinished={() => setIsFinishedText(true)}
        style={{ zIndex }}
      />
    ) : null;
  };

  const top = '65vw';
  const left = '50vh';

  useEffect(() => {
    // on starting navi
    if (naviState == 1) {
      setIsStartNavi(true);
      stepTimeline();
    }
    // on ending navi
    else if (naviState == 3) {
      window.setTimeout(() => stepTimeline());
    }
  }, [naviState]);

  return naviState != 3 ? (
    <>
      {isStartNavi ? <Dialog /> : null}
      <NavigationRobot top={top} left={left} style={{ zIndex }} />
    </>
  ) : null;
};

const Editor = ({
  zIndex,
}: {
  zIndex: number;
}) => {
  const isSelectEditor = useStore(g_currentScreen) == 'editor';

  return (
    <CodeEditor
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
          width: '95%',
          height: '80%',
          backgroundColor: 'BlueViolet',
          backgroundImage: `url('${imgsrc}')`,
          backgroundSize: '20%',
        }}
      >
        <Navigator zIndex={1} />
        <Dialog zIndex={1} />
        <Editor zIndex={0} />
        {/* canvas will be inserted here */}
      </div>

      <Buttons />
    </>
  );
};
