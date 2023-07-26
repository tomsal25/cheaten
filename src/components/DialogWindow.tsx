import { CSSProperties } from 'preact/compat';
import { Ref, useEffect, useRef, useState } from 'preact/hooks';
import styles from './DialogWindow.module.scss';

const NextIndicator = () => <span className={styles.next}>▼</span>;

const useClickText = (
  text: readonly string[],
  setFinishRead: () => void,
  dialogRef: Ref<HTMLDivElement>,
  initialPage = 0
) => {
  const [page, setPage] = useState(initialPage);
  const lastPage = text.length - 1;
  if (page > lastPage) setFinishRead();

  // on click
  useEffect(() => {
    const current = dialogRef.current;
    if (!current) return;
    const turnPage = () => setPage(p => p + 1);
    current.addEventListener('click', turnPage);
    return () => current.removeEventListener('click', turnPage);
  }, [text, dialogRef]);

  return page < lastPage ? text[page] : text[lastPage];
};

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
