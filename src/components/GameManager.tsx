import Phaser from 'phaser';
import { FunctionComponent } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

import { useStore } from '@nanostores/preact';

import { GAME_CONFIG } from '../config/Consts';
import { sceneList } from '../scenes';
import { g_count, g_currentSceneKey, g_isPlaying } from '../store/Store';
import { CodeEditor } from './CodeEditor';

const Buttons: FunctionComponent<{ text: string }> = ({ text }) => {
  const atmCnt = useStore(g_count);
  const flag = useStore(g_isPlaying);
  const handler = () => {
    text == '123' && g_isPlaying.set(!flag);
  };

  return (
    <>
      <button onClick={handler}>{flag ? 'playing' : 'paused'}</button>
      <button onClick={() => g_count.set(atmCnt + 1)}>{atmCnt}</button>
    </>
  );
};

export const GameManager = () => {
  const [text, setText] = useState('123');

  useEffect(() => {
    const _game = new Phaser.Game({ ...GAME_CONFIG, scene: sceneList });
    if (import.meta.env.DEV) {
      // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
      <Buttons text={text} />
      <CodeEditor text={text} setText={str => setText(str)} />
    </>
  );
};
