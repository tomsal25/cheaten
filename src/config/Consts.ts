import Phaser from 'phaser';
import { DEBUG_PHASER_CONFIG } from './Debug';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 1000;

export const GAME_ID = 'game-canvas';
export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,

  scale: {
    mode: Phaser.Scale.NONE,
    parent: GAME_ID,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      ...(DEBUG_PHASER_CONFIG
        ? { debug: true, debugShowVelocity: true, debugShowBody: true }
        : null),
    },
  },
};
