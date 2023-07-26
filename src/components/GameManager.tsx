import { useStore } from '@nanostores/preact';
import Phaser from 'phaser';
import { useEffect, useState } from 'preact/hooks';
import { GAME_CONFIG, GAME_ID } from '../config/Consts';
import {
  DEBUG_ASSIGN_GAME_AS_GLOBAL,
  DEBUG_CHECK_ISMOVE,
  DEBUG_LOG_CURRENT_SCENE,
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
  g_targetPosition,
  stepTimeline,
} from '../store/Store';
import { Editor } from './CodeEditor';
import { DialogWindow } from './DialogWindow';
import styles from './GameManager.module.scss';
import { NavigationRobot } from './NavigationRobot';

const _checkMove = () => {
  const isMove = useStore(DEBUG_g_isMove);
  const flag = useStore(g_flag);

  return (
    <>
      <button>{isMove ? 'moving' : 'paused'}</button>
      <button>{`flag${flag}`}</button>
    </>
  );
};

const DebugButtons = () => {
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

  const DialogChanger = () => {
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
      const element = document.querySelector<HTMLDivElement>('.dialog-window');
      if (!element) return;
      element.style.visibility = isVisible ? '' : 'hidden';
    }, [isVisible]);

    return (
      <button onClick={() => setIsVisible(f => !f)}>
        {isVisible ? 'visible' : 'invisible'}
      </button>
    );
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: ~1 >>> 1 }}>
      <Flag />
      <ScreenChanger />
      <DialogChanger />
      {DEBUG_CHECK_ISMOVE && <_checkMove />}
    </div>
  );
};

const Navigator = ({ zIndex }: { zIndex: number }) => {
  const [isStartNavi, setIsStartNavi] = useState(false);

  const naviState = useStore(g_naviState);
  const [x, y] = useStore(g_targetPosition);

  useEffect(() => {
    // on starting navi
    if (naviState == 1) {
      setIsStartNavi(true);
      stepTimeline();
    }
    // on ending navi
    else if (naviState == 3) {
      g_naviState.set(0);
      g_targetPosition.set([0, 0]);
      setIsStartNavi(false);
      stepTimeline();
    }
  }, [naviState]);

  return isStartNavi ? (
    <>
      <NavigationRobot
        top={x ? `${x}px` : null}
        left={y ? `${y}px` : null}
        style={{ zIndex }}
      />
    </>
  ) : null;
};

const Dialog = ({ zIndex }: { zIndex: number }) => {
  const [isFinishedText, setIsFinishedText] = useState(false);
  const nextText = useStore(g_nextText);

  // check if finished reading
  useEffect(() => {
    if (g_naviState.get() == 2 && isFinishedText) {
      setIsFinishedText(false);
      g_nextText.set(null);
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

const GameCanvas = ({ zIndex }: { zIndex: number }) => {
  useEffect(() => {
    const _game = new Phaser.Game({ ...GAME_CONFIG, scene: sceneList });
    if (DEBUG_ASSIGN_GAME_AS_GLOBAL) {
      Object.assign(window, { _game });
    }
    if (DEBUG_LOG_CURRENT_SCENE) {
      Object.assign(window, { _showScenes: () => _game.scene.dump() });
    }

    // do refresh, or position won't work properly after touching input element
    const refreshCanvas = () => _game.scale.refresh();
    _game.canvas.addEventListener('transitionend', refreshCanvas);

    const unsubscriberList = [
      g_isPlaying.listen(isPlaying => {
        const currentScene = g_currentSceneKey.get();
        if (!currentScene) return;
        if (isPlaying) {
          _game.scene.resume(currentScene);
        } else {
          _game.scene.pause(currentScene);
        }
      }),
      g_currentScreen.subscribe(screen => {
        Object.assign(_game.canvas.style, {
          // TODO: consider style like turning a page of books
          transform: `${screen == 'game' ? '' : 'scale(0)'}`,
          transition: `transform ${screen == 'game' ? '1s' : '.5s'} ease`,
        } as CSSStyleDeclaration);
      }),
      () => _game.canvas.removeEventListener('transitionend', refreshCanvas),
    ];

    return () => {
      unsubscriberList.forEach(fn => fn());
      _game.destroy(true);
    };
  }, []);

  return (
    <div className={styles.canvas_wrapper} style={{ zIndex }}>
      <div id={GAME_ID} className={styles.canvas_parent}>
        {/* canvas will be inserted here */}
      </div>
    </div>
  );
};

export const GameManager = () => {
  useEffect(() => {
    g_currentScreen.set('game');
  }, []);

  return (
    <>
      <div className={styles.box}>
        <Editor zIndex={1} />
        <Navigator zIndex={9} />
        <Dialog zIndex={5} />
        <GameCanvas zIndex={0} />
      </div>
      {import.meta.env.DEV ? <DebugButtons /> : null}
    </>
  );
};
