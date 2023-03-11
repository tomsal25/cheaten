import Phaser from 'phaser';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config/Consts';
import { IMAGE_KEY, SCENE_KEY } from '../config/KeyStore';
import { g_currentSceneKey } from '../store/Store';

export class Title extends Phaser.Scene {
  private isReady = false;
  private isStarted = false;

  constructor() {
    super({ key: SCENE_KEY.TITLE });
  }

  preload() {
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image(IMAGE_KEY.SKY, 'assets/skies/space3.png');
    this.load.image(IMAGE_KEY.LOGO, 'assets/sprites/phaser3-logo.png');
    this.load.image(IMAGE_KEY.RED, 'assets/particles/red.png');
    this.load.image(IMAGE_KEY.SKY_BG, 'assets/skies/gradient13.png');
    this.load.image(IMAGE_KEY.WIZBALL, 'assets/sprites/wizball.png');
    this.load.image(IMAGE_KEY.SHIP, 'assets/sprites/ship.png');
    this.load.image(IMAGE_KEY.BULLET, 'assets/sprites/bullet.png');
    this.load.image(IMAGE_KEY.ENEMY, 'assets/particles/elec1.png');
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

    g_currentSceneKey.set(SCENE_KEY.TITLE);
  }
  update() {
    //
  }
}
