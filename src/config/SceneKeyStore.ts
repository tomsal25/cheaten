export const TITLE = 's0';
export const HOME = 's_';
export const STAGE1 = 's1';
export const STAGE2 = 's2';
export const EX = 's00';

const STAGE_KEY_LIST = [STAGE1, STAGE2, EX] as const;
export type STAGE_KEY = (typeof STAGE_KEY_LIST)[number];

const SCENE_KEY_LIST = [TITLE, ...STAGE_KEY_LIST] as const;
export type SCENE_KEY = (typeof SCENE_KEY_LIST)[number];
