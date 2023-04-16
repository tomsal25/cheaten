import { useEffect, useState } from 'preact/hooks';

import './app.css';
import { GameManager } from './components/GameManager';

const StartButton = ({ setStart }: { setStart: () => void }) => {
  return (
    <div>
      <button onClick={setStart}>Let's Start!</button>
    </div>
  );
};

const useKeepFullScreen = () => {
  const CSS_VAR_VW = '--100vw';
  const CSS_VAR_VH = '--100vh';

  useEffect(() => {
    if (import.meta.env.DEV) {
      document.documentElement.style.getPropertyValue(CSS_VAR_VW).length &&
        console.error('property --100vw has been already used.');
      document.documentElement.style.getPropertyValue(CSS_VAR_VH).length &&
        console.error('property --100vh has been already used.');
    }

    Object.assign(document.body.style, {
      width: `var(${CSS_VAR_VW},100vw)`,
      height: `var(${CSS_VAR_VH},100vh)`,
    });

    const setLazySize = () => {
      // TODO: check delay time
      // window.setTimeout(() => {
      //   const { style, clientWidth, clientHeight } = document.documentElement;
      //   style.setProperty(CSS_VAR_VW, `${clientWidth}px`);
      //   style.setProperty(CSS_VAR_VH, `${clientHeight}px`);
      // }, 100);
      const { style, clientWidth, clientHeight } = document.documentElement;
      style.setProperty(CSS_VAR_VW, `${clientWidth}px`);
      style.setProperty(CSS_VAR_VH, `${clientHeight}px`);
    };

    // run once on called
    setLazySize();
    window.addEventListener('resize', setLazySize);

    return () => {
      window.removeEventListener('resize', setLazySize);
      if (import.meta.env.DEV) {
        document.documentElement.style.removeProperty(CSS_VAR_VW);
        document.documentElement.style.removeProperty(CSS_VAR_VH);
      }
    };
  }, []);
};

export const App = () => {
  const [isStart, setIsStart] = useState(false);
  // const [isStart, setIsStart] = useState(true);
  useKeepFullScreen();

  return (
    <>
      {isStart ? (
        <GameManager />
      ) : (
        <StartButton setStart={() => setIsStart(true)} />
      )}
    </>
  );
};
