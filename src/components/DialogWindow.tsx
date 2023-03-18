import { CSSProperties } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import './DialogWindow.css';

const NextIndicator = () => (
  <span
    style={{ marginLeft: 3, backgroundColor: 'BlueViolet', color: 'Khaki' }}
  >
    ▼
  </span>
);

const useClickText = (
  text: string[],
  setFinishRead: () => void,
  initialPage = 0
) => {
  const [page, setPage] = useState(initialPage);
  const lastPage = text.length - 1;
  if (page > lastPage) setFinishRead();

  // on click
  useEffect(() => {
    const turnPage = () => setPage(p => p + 1);
    window.addEventListener('click', turnPage);
    return () => window.removeEventListener('click', turnPage);
  }, [text]);

  return page < lastPage ? text[page] : text[lastPage];
};

export const DialogWindow = ({
  name,
  text,
  setFinished,
  style,
}: {
  name: string;
  text: string[];
  setFinished: () => void;
  style?: CSSProperties;
}) => {
  const [isFinishRead, setIsFinishRead] = useState(false);
  const displayText = useClickText(text, () => setIsFinishRead(true));
  const [originalStyle, setOriginalStyle] = useState<CSSProperties>({
    opacity: 0,
  });

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
      className="dialog-window"
      style={{
        transition: 'opacity .3s 0s ease-in-out',
        ...originalStyle,
        ...style,
      }}
    >
      <div className="dialog-name">{name}</div>
      <div className="dialog-text">
        {displayText}
        <NextIndicator />
      </div>
    </div>
  );
};
