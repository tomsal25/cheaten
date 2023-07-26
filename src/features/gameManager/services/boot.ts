import Phaser from 'phaser';
import { GAME_CONFIG } from '../../../config/Consts';
import {
  DEBUG_ASSIGN_GAME_AS_GLOBAL,
  DEBUG_LOG_CURRENT_SCENE,
} from '../../../config/Debug';
import { sceneList } from '../../../scenes';
import {
  g_currentSceneKey,
  g_currentScreen,
  g_isPlaying,
} from '../../../store/Store';

/**
 * A function which boots Phaser and rerutn destructor
 *
 * @returns {function(): void} destructor
 */
export const boot = (): (() => void) => {
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
};
