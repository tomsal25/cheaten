const SCENE_PREFIX = 's';
const IMAGE_PREFIX = 'i';

export const SCENE_KEY = {
  TITLE: `${SCENE_PREFIX}0`,
  STAGE1: `${SCENE_PREFIX}1`,
  STAGE2: `${SCENE_PREFIX}2`,
  EX: `${SCENE_PREFIX}00`,
} as const;

export const IMAGE_KEY = {
  SKY: `${IMAGE_PREFIX}0`,
  LOGO: `${IMAGE_PREFIX}1`,
  RED: `${IMAGE_PREFIX}2`,
  SKY_BG: `${IMAGE_PREFIX}3`,
  WIZBALL: `${IMAGE_PREFIX}4`,
  SHIP: `${IMAGE_PREFIX}5`,
  BULLET: `${IMAGE_PREFIX}6`,
  ENEMY: `${IMAGE_PREFIX}7`,
} as const;

export type SCENE_KEY_LIST = (typeof SCENE_KEY)[keyof typeof SCENE_KEY];
export type STAGE_KEY_LIST = Exclude<SCENE_KEY_LIST, typeof SCENE_KEY.TITLE>;
export type IMAGE_KEY_LIST = (typeof IMAGE_KEY)[keyof typeof IMAGE_KEY];
