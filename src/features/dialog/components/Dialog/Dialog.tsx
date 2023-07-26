import { useStore } from '@nanostores/preact';
import { useEffect, useState } from 'preact/hooks';
import { g_naviState, g_nextText, stepTimeline } from '../../../../store/Store';
import { DialogWindow } from '../Window/Window';

export const Dialog = ({ zIndex }: { zIndex: number }) => {
  const [isFinishedText, setIsFinishedText] = useState(false);
  const nextText = useStore(g_nextText);

  // check if finished reading
  useEffect(() => {
    if (g_naviState.get() == 2 && isFinishedText) {
      setIsFinishedText(false);
      g_nextText.set(null);
      stepTimeline();
    }
  }, [isFinishedText]);

  return !isFinishedText && nextText ? (
    <DialogWindow
      name="Robot"
      text={nextText}
      setFinished={() => setIsFinishedText(true)}
      style={{ zIndex }}
    />
  ) : null;
};
