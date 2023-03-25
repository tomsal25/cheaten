const isDev = import.meta.env.DEV;

export const DEBUG_PREACT_DEBUG = isDev && true;
export const DEBUG_PHASER_CONFIG = isDev && true;
export const DEBUG_ASSIGN_GAME_AS_GLOBAL = isDev && true;
export const DEBUG_DISPLAY_CURRENT_SCENE = isDev && true;
export const DEBUG_DISPLAY_TIMELINE = isDev && true;
export const DEBUG_VALIDATE_FLAG = isDev && true;

// to debug stages
export const DEBUG_CHECK_ISMOVE = isDev && true;
export const DEBUG_g_isMove = atom(false);
