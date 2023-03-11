import Phaser from 'phaser';
import { IMAGE_KEY, SCENE_KEY } from '../../config/KeyStore';
import { g_currentSceneKey } from '../../store/Store';

export class Stage1 extends Phaser.Scene {
  private ball1?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private ball2?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  constructor() {
    super({ key: SCENE_KEY.STAGE1 });
  }

  preload() {
    //
  }

  create() {
    this.add.image(400, 500, IMAGE_KEY.SKY_BG);
    this.add.text(100, 100, 'Stage 1').setFontSize(64).setColor('#ff0');

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
      .setCollideWorldBounds(true)
      .setInteractive()
      .once('pointerdown', () => this.scene.start(SCENE_KEY.EX));

    const group = this.physics.add.group({
      key: IMAGE_KEY.WIZBALL,
      'setXY.stepX': 2,
      'setXY.stepY': 4,
      quantity: 150,
      bounceX: 1,
      bounceY: 1,
      velocityX: 200,
      velocityY: 400,
      collideWorldBounds: true,
    });

    group.children.each(obj => {
      const { body } = obj;

      if (body instanceof Phaser.Physics.Arcade.Body) {
        const radius = body.sourceHeight / 5;
        body.setCircle(
          radius,
          body.sourceWidth / 2 - radius,
          body.sourceHeight / 2 - radius
        );
        this.tweens.add({
          targets: obj,
          scale: 2,
          angle: 360,
          ease: Phaser.Math.Easing.Back.InOut,
          duration: 500,
          delay: 50,
          repeat: -1,
          yoyo: true,
          hold: 1000,
          repeatDelay: 100,
        });
      }
    });

    this.ball1 = this.physics.add.image(100, 240, IMAGE_KEY.WIZBALL);
    this.ball2 = this.physics.add.image(700, 240, IMAGE_KEY.WIZBALL);
    const rad = this.ball1.height / 3;
    this.ball1
      .setCircle(rad, this.ball1.width / 2 - rad, this.ball1.height / 2 - rad)
      .setCollideWorldBounds(true)
      .setBounce(0.7, 1)
      .setActive(false)
      .setVelocity(50, 50)
      .setAcceleration(100);

    this.ball2
      .setCollideWorldBounds(true)
      .setBounce(1, 1)
      .setVelocity(100, 200);

    emitter.startFollow(logo);

    this.physics.add.overlap(logo, group, this.handler);
    this.physics.add.collider(this.ball1, this.ball2);
    this.physics.add.collider(this.ball1, group, this.handler);

    g_currentSceneKey.set(SCENE_KEY.STAGE1);
  }

  update() {
    //
  }

  private handler: ArcadePhysicsCallback = (ball1, obj2) => {
    obj2.destroy();
  };
}
