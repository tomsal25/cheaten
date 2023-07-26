import { CSSProperties } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useClickText } from '../../hooks/useClickText';
import styles from './Window.module.scss';

const NextIndicator = () => <span className={styles.next}>▼</span>;

export const DialogWindow = ({
  name,
  text,
  setFinished,
  style,
}: {
  name: string;
  text: readonly string[];
  setFinished: () => void;
  style?: CSSProperties;
}) => {
  const [isFinishRead, setIsFinishRead] = useState(false);
  const [originalStyle, setOriginalStyle] = useState<CSSProperties>({
    opacity: 0,
  });
  const ref = useRef<HTMLDivElement>(null);

  const displayText = useClickText(text, () => setIsFinishRead(true), ref);

  // on start
  useEffect(() => {
    window.setTimeout(() => setOriginalStyle({ opacity: 1 }), 100);
  }, []);

  // on finish reading
  useEffect(() => {
    if (isFinishRead) {
      setOriginalStyle({ opacity: 0 });
      window.setTimeout(() => setFinished(), 320);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinishRead]);

  return (
    <div
      ref={ref}
      className={styles.box}
      style={{ ...originalStyle, ...style }}
    >
      <div className={styles.name}>{name}</div>
      <div className={styles.text}>
        {displayText}
        <NextIndicator />
      </div>
    </div>
  );
};
