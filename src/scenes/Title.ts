import Phaser from 'phaser';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config/Consts';
import { DEBUG_SKIP_TITLE_SCENE } from '../config/Debug';
import * as IMAGE_KEY from '../config/ImageKeyStore';
import * as SCENE_KEY from '../config/SceneKeyStore';

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
    this.isReady = false;
    this.isStarted = false;
    // title
    this.add
      .text(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 3) * 1, 'Cheaten')
      .setColor('#ff0')
      .setFontSize(120)
      .setOrigin(0.5);

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
        this.time.delayedCall(1500, () => {
          if (!this.game.scene.getScene(SCENE_KEY.STAGE1)) {
            import('./stage1/Stage1')
              .then(e => {
                this.game.scene.add(SCENE_KEY.STAGE1, e.Stage1);
                this.scene.start(SCENE_KEY.STAGE1);
              })
              .catch(null);
          } else this.scene.start(SCENE_KEY.STAGE1);
        });
      });

    // effects on starting
    this.cameras.main.fadeIn(1000, 0, 0, 0, (_: unknown, n: number) => {
      if (n == 1) this.isReady = true;
    });

    if (DEBUG_SKIP_TITLE_SCENE) {
      import('./stage1/Stage1')
        .then(e => {
          this.game.scene.add(SCENE_KEY.STAGE1, e.Stage1);
          this.scene.start(SCENE_KEY.STAGE1);
        })
        .catch(null);
    }
  }
}
