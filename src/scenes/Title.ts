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
    this.load.image(IMAGE_KEY.BG_1, '/assets/img/bg1.png');
    this.load.image(IMAGE_KEY.YOU, '/assets/img/you.png');
    this.load.image(IMAGE_KEY.YOU_BULLET, '/assets/img/me_bullet.png');
    this.load.image(IMAGE_KEY.ENEMY, '/assets/img/enemy.png');
    this.load.image(IMAGE_KEY.ENEMY_BULLET, '/assets/img/enemy_bullet.png');

    // this.load.image(IMAGE_KEY.SKY);
    // this.load.image(IMAGE_KEY.LOGO);
    // this.load.image(IMAGE_KEY.RED);
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
          import('./home/Home')
            .then(e => {
              this.game.scene.add(SCENE_KEY.HOME, e.Home);
            })
            .catch(null);
          import('./stage1/Stage1')
            .then(e => {
              this.game.scene.add(SCENE_KEY.STAGE1, e.default);
              this.scene.start(SCENE_KEY.STAGE1);

              // remove this scene after some seconds
              setTimeout(() => {
                this.scene.remove(this);
              }, 100);
            })
            .catch(null);
        });
      });

    // effects on starting
    this.cameras.main.fadeIn(1000, 0, 0, 0, (_: unknown, n: number) => {
      if (n == 1) this.isReady = true;
    });

    if (DEBUG_SKIP_TITLE_SCENE) {
      import('./home/Home')
        .then(e => {
          this.game.scene.add(SCENE_KEY.HOME, e.Home);
          // this.scene.start(SCENE_KEY.HOME);
        })
        .catch(null);
      import('./stage1/Stage1')
        .then(e => {
          this.game.scene.add(SCENE_KEY.STAGE1, e.default);
          this.scene.start(SCENE_KEY.STAGE1);

          // remove this scene after some seconds
          setTimeout(() => {
            this.scene.remove(this);
          }, 100);
        })
        .catch(null);
    }
  }
}
