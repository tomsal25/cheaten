import { atom } from 'nanostores';
import {
  DEBUG_DISPLAY_CURRENT_SCENE,
  DEBUG_DISPLAY_TIMELINE,
  DEBUG_VALIDATE_FLAG,
} from '../config/Debug';
import { SCENE_KEY, STAGE_KEY_LIST } from '../config/KeyStore';

export const g_count = atom(0);
export const g_isPlaying = atom(true);

type Screen = 'init' | 'game' | 'editor';
export const g_currentScreen = atom<Screen>('init');

export const g_currentSceneKey = atom<STAGE_KEY_LIST | null>(null);
if (DEBUG_DISPLAY_CURRENT_SCENE) {
  g_currentSceneKey.listen(
    v =>
      v &&
      console.log(
        (Object.keys(SCENE_KEY) as (keyof typeof SCENE_KEY)[]).find(
          val => SCENE_KEY[val] === v
        )
      )
  );
}

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
  position?: number;
  text: string | string[];
}
interface Flag {
  type: 'flag';
  flag: number;
}
type Timeline = Init | NaviStart | NaviEnd | Navi | Flag;
export type TimelineList = Timeline[];

const g_timelineList = atom<TimelineList>([{ type: 'init' }]);
const g_timelineNumber = atom(0);

// 0=init, 1=onStart, 2=running, 3=onStop
export const g_naviState = atom<0 | 1 | 2 | 3>(0);
export const g_nextText = atom<string[] | null>(null);
export const g_flag = atom(0);

const setState = (timeline: Timeline) => {
  if (DEBUG_DISPLAY_TIMELINE) {
    console.log(timeline);
  }
  const { type } = timeline;
  if (type == 'navistart') {
    // TODO: don't stop the game
    // window.setTimeout(() => g_isPlaying.set(false), 0);
    g_naviState.set(1);
  } else if (type == 'naviend') {
    // window.setTimeout(() => g_isPlaying.set(true), 0);
    g_naviState.set(3);
    g_nextText.set(null);
  } else if (type == 'navi') {
    const { text } = timeline;
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
  setState(timeline);
  g_timelineNumber.set(nextNumber);
};

// initialize the timeline and the number
export const setTimelineList = (timelineList: TimelineList) => {
  g_timelineList.set(timelineList);
  g_timelineNumber.set(0);
  setState(timelineList[0]);
};
