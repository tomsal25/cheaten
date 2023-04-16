import { atom } from 'nanostores';

const isDev = import.meta.env.DEV;

export const DEBUG_PREACT_DEBUG = isDev && true;
export const DEBUG_PHASER_CONFIG = isDev && true;
export const DEBUG_ASSIGN_GAME_AS_GLOBAL = isDev && true;

// global store
export const DEBUG_LOG_CURRENT_SCENE = isDev && true;
export const DEBUG_LOG_TIMELINE = isDev && true;

// check flags on transition
export const DEBUG_VALIDATE_FLAG = isDev && true;

// to debug stages
export const DEBUG_CHECK_DUPLICATE_EVENT = isDev && true;
export const DEBUG_CHECK_ISMOVE = isDev && true;
export const DEBUG_g_isMove = atom(false);

// skip something
export const DEBUG_SKIP_WELCOME_SCREEN = isDev && true;
export const DEBUG_SKIP_TITLE_SCENE = isDev && true;
