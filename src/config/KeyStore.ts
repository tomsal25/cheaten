const SCENE_PREFIX = 's';
const IMAGE_PREFIX = 'i';

export const SCENE_KEY = {
  TITLE: `${SCENE_PREFIX}0`,
  STAGE1: `${SCENE_PREFIX}1`,
  STAGE2: `${SCENE_PREFIX}2`,
  EX: `${SCENE_PREFIX}00`,
} as const;

export const IMAGE_KEY = {
  TITLE: `${IMAGE_PREFIX}title`,
} as const;

export type SCENE_KEY_LIST = (typeof SCENE_KEY)[keyof typeof SCENE_KEY];
export type IMAGE_KEY_LIST = (typeof IMAGE_KEY)[keyof typeof IMAGE_KEY];
