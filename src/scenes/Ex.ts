import Phaser from 'phaser';

import { IMAGE_KEY, SCENE_KEY } from '../config/KeyStore';
import { g_count, g_currentSceneKey } from '../store/Store';

export class Ex extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEY.EX });
  }

  preload() {
    this.load.setBaseURL('https://labs.phaser.io');

    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  create() {
    this.add.image(400, 300, IMAGE_KEY.SKY);
    this.add.text(200, 200, 'Phaser 3').setFontSize(64).setColor('#0f0');

    const particles = this.add.particles(IMAGE_KEY.RED);
    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD',
    });

    const logo = this.physics.add
      .image(400, 100, IMAGE_KEY.LOGO)
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    emitter.startFollow(logo);

    const ball2 = this.add.image(70, 20, IMAGE_KEY.WIZBALL);

    this.tweens.add({
      targets: ball2,
      duration: 10000,
      loop: 1,
      yoyo: true,
      props: {
        x: {
          value: '+=300',
          duration: 3000,
          ease: Phaser.Math.Easing.Expo.InOut,
        },
        y: {
          value: '500',
          duration: 1500,
          ease: Phaser.Math.Easing.Bounce.Out,
        },
      },
    });

    const text = this.add
      .text(250, 150, 'Click here!')
      .setFontSize(30)
      .setInteractive()
      .once('pointerdown', () => {
        text.setText('OK!!');
        g_count.set(1000000);
        this.scene.start(SCENE_KEY.STAGE2);
      });

    g_currentSceneKey.set(SCENE_KEY.EX);
  }

  update() {
    //
  }
}
