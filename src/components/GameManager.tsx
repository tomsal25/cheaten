import Phaser from 'phaser';
import { FunctionComponent } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

import { useStore } from '@nanostores/preact';

import { SCENE_KEY } from '../config/KeyStore';
import { atomCount, atomFlag } from '../store/Store';
import { CodeEditor } from './CodeEditor';

const Buttons: FunctionComponent<{ text: string }> = ({ text }) => {
  const atmCnt = useStore(atomCount);
  const handler = () => {
    text == '123' && atomFlag.set(true);
  };

  return (
    <>
      <button onClick={handler}>cilck me!</button>
      <button onClick={() => atomCount.set(atmCnt + 1)}>{atmCnt}</button>
    </>
  );
};

export const GameManager: FunctionComponent<{
  game: Phaser.Game;
}> = ({ game }) => {
  const [text, setText] = useState('123');

  const flag = useStore(atomFlag);

  useEffect(() => {
    if (flag) {
      game.scene.stop(SCENE_KEY.TITLE);
      game.scene.start(SCENE_KEY.STAGE2);
    }
    atomFlag.set(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag]);

  return (
    <>
      <Buttons text={text} />
      <CodeEditor text={text} setText={str => setText(str)} />
    </>
  );
};
