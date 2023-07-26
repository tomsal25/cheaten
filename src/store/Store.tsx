import { atom } from 'nanostores';
import { DEBUG_LOG_TIMELINE, DEBUG_VALIDATE_FLAG } from '../config/Debug';
import * as SCENE_KEY from '../config/SceneKeyStore';
import { InputInfo } from '../features/editor/components/CustomInput/CustomInput';

// TODO: remove these
export const g_count = atom(0);
export const g_isPlaying = atom(true);

type Screen = 'init' | 'game' | 'editor';
export const g_currentScreen = atom<Screen>('init');
// TODO: remove this
export const g_currentSceneKey = atom<SCENE_KEY.STAGE_KEY | null>(null);

interface Init {
  type: 'init';
}
interface NaviStart {
  type: 'navistart';
}
interface NaviEnd {
  type: 'naviend';
}
interface Navi {
  type: 'navi';
  text: string | readonly string[];
}
interface Flag {
  type: 'flag';
  flag: number;
}
type Timeline = Readonly<Init | NaviStart | NaviEnd | Navi | Flag>;
export type TimelineList = readonly Timeline[];

const g_timelineList = atom<TimelineList>([{ type: 'init' }]);
const g_timelineNumber = atom(0);

// 0=init, 1=onStart, 2=running, 3=onStop
export const g_naviState = atom<0 | 1 | 2 | 3>(0);
export const g_nextText = atom<readonly string[] | null>(null);
export const g_flag = atom(0);

export const g_codeString = atom('');
export const g_isInputEnabled = atom(false);
export const g_targetPosition = atom<readonly [x: number, y: number]>([0, 0]);
export const g_targetScrollPos = atom<readonly [x: number, y: number]>([0, 0]);
export const g_inputValueList = atom<readonly string[]>([]);
export const g_isSubmitted = atom(false);
export const g_componentInfoList = atom<readonly InputInfo[] | null>(null);

const setState = (timeline: Timeline) => {
  if (DEBUG_LOG_TIMELINE) console.log(timeline);

  const type = timeline.type;
  if (type == 'navistart') {
    g_isInputEnabled.set(false);
    g_naviState.set(1);
  } else if (type == 'naviend') {
    g_naviState.set(3);
  } else if (type == 'navi') {
    const text = timeline.text;
    g_naviState.set(2);
    g_nextText.set(Array.isArray(text) ? text : [text]);
  } else if (type == 'flag') {
    g_flag.set(timeline.flag);
  }
};

// move to the next timeline with changing some states
export const stepTimeline = () => {
  const nextNumber = g_timelineNumber.get() + 1;
  const timeline = g_timelineList.get()[nextNumber];
  g_timelineNumber.set(nextNumber);
  setState(timeline);
};

// initialize the timeline and the number
export const setTimelineList = (timelineList: TimelineList) => {
  g_timelineList.set(timelineList);
  g_timelineNumber.set(0);
  setState(timelineList[0]);
};

export const setWaitFlag = () => g_flag.set(-1);

// search a flag from the list and set the global flag
export const setGlobalFlag = (flag: number) => {
  if (DEBUG_VALIDATE_FLAG) {
    const flagAmount = g_timelineList.get().filter((timeline, i) => {
      if (timeline.type == 'flag' && timeline.flag == flag) {
        setState(timeline);
        g_timelineNumber.set(i);
        return true;
      }
      return false;
    }).length;

    // check if a flag is valid
    if (flagAmount == 0) {
      throw new Error(`There is NO flag: No.${flag}`);
    } else if (flagAmount > 1) {
      throw new Error(`Flag is duplicated: No.${flag}`);
    }
  } else {
    g_timelineList.get().forEach((timeline, i) => {
      if (timeline.type == 'flag' && timeline.flag == flag) {
        setState(timeline);
        g_timelineNumber.set(i);
      }
    });
  }
};
