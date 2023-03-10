import Phaser from 'phaser';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config/Consts';
import { SCENE_KEY } from '../config/KeyStore';
import { currentSceneKey } from '../store/Store';

export class Title extends Phaser.Scene {
  private isReady = false;
  private isStarted = false;

  constructor() {
    super({ key: SCENE_KEY.TITLE });
  }

  preload() {
    //
  }
  create() {
    this.physics.world.on('pause', () => {
      console.log('paused');
    });

    // title
    this.add
      .text(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 3) * 1, 'Cheaten')
      .setColor('#ff0')
      .setFontSize(120)
      .setOrigin(0.5)
      .setInteractive();

    // start button
    this.add
      .text(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 3) * 2, 'Start Game')
      .setColor('#fff')
      .setFontSize(64)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        if (!this.isReady || this.isStarted) return;
        this.isStarted = true;
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.time.delayedCall(1500, () => this.scene.start(SCENE_KEY.STAGE1));
      });

    // effects on starting
    this.cameras.main.fadeIn(1000, 0, 0, 0, (_: unknown, n: number) => {
      if (n == 1) this.isReady = true;
    });

    currentSceneKey.set(SCENE_KEY.TITLE);
  }
  update() {
    //
  }
}
