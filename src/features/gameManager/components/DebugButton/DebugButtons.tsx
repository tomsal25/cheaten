import { useStore } from '@nanostores/preact';
import { useEffect, useState } from 'preact/hooks';
import { DEBUG_CHECK_ISMOVE, DEBUG_g_isMove } from '../../../../config/Debug';
import { g_currentScreen, g_flag, g_isPlaying } from '../../../../store/Store';

export const DebugButtons = () => {
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

  let dialog_window = '';

  const DialogChanger = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      void (async () => {
        const { default: style } = await import(
          '../features/dialog/components/Window/Window.module.scss'
        );
        dialog_window = style.box;
      })();
    }, []);

    useEffect(() => {
      if (!dialog_window.length) return;

      const element = document.getElementsByClassName(dialog_window)[0];
      if (!(element instanceof HTMLElement)) return;

      element.style.visibility = isVisible ? '' : 'hidden';
    }, [isVisible]);

    return (
      <button onClick={() => setIsVisible(f => !f)}>
        {isVisible ? 'visible' : 'invisible'}
      </button>
    );
  };

  const CheckMove = () => {
    const isMove = useStore(DEBUG_g_isMove);
    const flag = useStore(g_flag);

    return (
      <>
        <button>{isMove ? 'moving' : 'paused'}</button>
        <button>{`flag${flag}`}</button>
      </>
    );
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: ~1 >>> 1 }}>
      <Flag />
      <ScreenChanger />
      <DialogChanger />
      {DEBUG_CHECK_ISMOVE && <CheckMove />}
    </div>
  );
};
