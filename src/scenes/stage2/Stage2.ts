import Phaser from 'phaser';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config/Consts';
import { IMAGE_KEY, SCENE_KEY } from '../../config/KeyStore';
import { g_currentSceneKey } from '../../store/Store';

export class Stage2 extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private bullets!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private text!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENE_KEY.STAGE2 });
  }

  preload() {
    //
  }
  create() {
    this.player = this.physics.add
      .sprite(400, 500, IMAGE_KEY.SHIP)
      .setScale(0.5)
      .setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.bullets = this.physics.add.group({
      defaultKey: IMAGE_KEY.BULLET,
      maxSize: 600,
    });

    this.enemies = this.physics.add.group({
      defaultKey: IMAGE_KEY.ENEMY,
      maxSize: 1000,
    });

    this.time.addEvent({
      delay: 1100,
      repeat: 10,
      callback: this.addEnemy,
      loop: true,
    });

    this.text = this.add.text(10, 10, '').setFontSize(64);

    this.input.on('pointermove', () => {
      const { x, y } = this.input.activePointer;
      this.player.setPosition(x, y);
    });
    this.input.on('pointerdown', () => {
      const { x, y } = this.input.activePointer;
      this.player.setPosition(x, y);
    });

    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy);
    this.physics.add.overlap(this.player, this.enemies, this.hitPlayer);

    g_currentSceneKey.set(SCENE_KEY.STAGE2);
  }
  update() {
    if (!this.player.active) return;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200);
    }

    if (this.input.activePointer.isDown) {
      this.fireBullet();
    }

    this.text.setText([
      `Bullets: ${this.bullets.countActive()}`,
      `Enemy: ${this.enemies.countActive()}`,
      `fps: ${this.game.loop.actualFps}`,
    ]);

    this.enemies.children.iterate(e =>
      this.physics.moveToObject(e, this.player, 100)
    );

    this.bullets.children.each(obj => {
      const { body } = obj;
      if (body instanceof Phaser.Physics.Arcade.Body) {
        if (Math.abs(body.y) > CANVAS_HEIGHT) obj.destroy(true);
      }
    });
  }

  private fireBullet = () => {
    if (this.bullets.isFull()) return;
    const bullet =
      this.bullets.get() as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    bullet
      .enableBody(true, this.player.x, this.player.y, true, true)
      .setVelocityY(-300);
  };

  private addEnemy = () => {
    if (this.enemies.isFull()) return;
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.RND.between(0, CANVAS_WIDTH);
      const y = Phaser.Math.RND.between(0, CANVAS_HEIGHT / 10);
      this.enemies.create(x, y);
      console.log(
        this.enemies.getLast() as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
      );
      //  .setVelocityY(10);
      this.enemies.setVelocityY(100);
    }
  };

  private hitEnemy: ArcadePhysicsCallback = (bullet, enemy) => {
    bullet.destroy(true);
    enemy.destroy(true);
  };

  private hitPlayer: ArcadePhysicsCallback = player => {
    player.destroy(true);
  };
}
