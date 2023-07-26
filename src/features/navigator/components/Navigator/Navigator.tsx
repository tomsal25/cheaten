import { useStore } from '@nanostores/preact';
import { useEffect, useState } from 'preact/hooks';
import {
  g_naviState,
  g_targetPosition,
  stepTimeline,
} from '../../../../store/Store';
import { NavigationRobot } from '../Robot/NavigationRobot';

export const Navigator = ({ zIndex }: { zIndex: number }) => {
  const [isStartNavi, setIsStartNavi] = useState(false);

  const naviState = useStore(g_naviState);
  const [x, y] = useStore(g_targetPosition);

  useEffect(() => {
    // on starting navi
    if (naviState == 1) {
      setIsStartNavi(true);
      stepTimeline();
    }

    // on ending navi
    else if (naviState == 3) {
      g_naviState.set(0);
      g_targetPosition.set([0, 0]);
      setIsStartNavi(false);
      stepTimeline();
    }
  }, [naviState]);

  return isStartNavi ? (
    <>
      <NavigationRobot
        top={x ? `${x}px` : null}
        left={y ? `${y}px` : null}
        style={{ zIndex }}
      />
    </>
  ) : null;
};
