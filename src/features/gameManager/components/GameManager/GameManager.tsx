import { useState } from 'preact/hooks';
import { GAME_ID } from '../../../../config/Consts';
import { DEBUG_SKIP_WELCOME_SCREEN } from '../../../../config/Debug';
import { g_currentScreen } from '../../../../store/Store';
import { Dialog } from '../../../dialog/components/Dialog/Dialog';
import { Editor } from '../../../editor/components/Editor/Editor';
import { Navigator } from '../../../navigator/components/Navigator/Navigator';
import { boot } from '../../services/boot';
import { DebugButtons } from '../DebugButton/DebugButtons';
import { StartButton } from '../StartButton/StartButton';
import styles from './GameManager.module.scss';

const GameCanvas = ({ zIndex }: { zIndex: number }) => {
  return (
    <div className={styles.canvaswrapper} style={{ zIndex }}>
      <div id={GAME_ID} className={styles.canvasparent}>
        {/* canvas will be inserted here */}
      </div>
    </div>
  );
};

export const GameManager = () => {
  const [isBoot, setIsBoot] = useState(false);
  const [destrutor, setDestrutor] = useState([
    () => {
      /* noop */
    },
  ]);

  const bootGame = () => {
    if (isBoot) return;
    setIsBoot(true);

    // boot Phaser
    const des = boot();

    // set destructor for something...
    setDestrutor([...destrutor, des]);

    // change screen
    g_currentScreen.set('game');
  };

  if (DEBUG_SKIP_WELCOME_SCREEN) {
    setTimeout(() => {
      bootGame();
    }, 1000);
  }

  return (
    <>
      <div className={styles.box}>
        {!isBoot ? (
          <div className={styles.btnbox} style={{ zIndex: 9 }}>
            <StartButton onClick={bootGame} />
          </div>
        ) : (
          <></>
        )}
        <Editor zIndex={1} />
        <Navigator zIndex={8} />
        <Dialog zIndex={5} />
        <GameCanvas zIndex={0} />
      </div>
      {import.meta.env.DEV ? <DebugButtons /> : <></>}
    </>
  );
};
