import Phaser from 'phaser';
import { useEffect } from 'preact/hooks';
import { GAME_CONFIG, GAME_ID } from '../../../../config/Consts';
import {
  DEBUG_ASSIGN_GAME_AS_GLOBAL,
  DEBUG_LOG_CURRENT_SCENE,
} from '../../../../config/Debug';
import { sceneList } from '../../../../scenes';
import {
  g_currentSceneKey,
  g_currentScreen,
  g_isPlaying,
} from '../../../../store/Store';
import { Dialog } from '../../../dialog/components/Dialog/Dialog';
import { Editor } from '../../../editor/components/Editor/Editor';
import { Navigator } from '../../../navigator/components/Navigator/Navigator';
import { DebugButtons } from '../DebugButton/DebugButtons';
import styles from './GameManager.module.scss';

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
    <div className={styles.canvaswrapper} style={{ zIndex }}>
      <div id={GAME_ID} className={styles.canvasparent}>
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
      {import.meta.env.DEV ? <DebugButtons /> : <></>}
    </>
  );
};
