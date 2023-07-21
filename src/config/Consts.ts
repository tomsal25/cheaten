import Phaser from 'phaser';
import { DEBUG_PHASER_CONFIG } from './Debug';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 1000;

export const GAME_ID = 'game-canvas';
export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,

  scale: {
    // TODO: set fixed size here and change it with css
    mode: Phaser.Scale.FIT,
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
