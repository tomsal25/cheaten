import Phaser from 'phaser';

const isDebug = import.meta.env.DEV;

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 1000;

export const GAME_ID = 'game-container';
export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    // for mobile app?
    // mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_VERTICALLY,
    parent: GAME_ID,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: isDebug,
      debugShowVelocity: isDebug,
      debugShowBody: isDebug,
    },
  },
} as const;
