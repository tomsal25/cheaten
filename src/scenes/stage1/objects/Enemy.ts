import Phaser from 'phaser';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../../config/Consts';
import * as IMAGE_KEY from '../../../config/ImageKeyStore';
import { BaseShooter } from '../../base/BaseShooter';
import { Bullet } from '../../base/Bullet';
import { LifeBar } from '../../base/LifeBar';

export class Shooter extends BaseShooter {
  private _lifeBar: LifeBar;

  constructor(scene: Phaser.Scene) {
    super(scene, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 5, IMAGE_KEY.ENEMY);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const width = 200;
    const height = 200;

    this.setDisplaySize(width, height).setBodySize(
      this.width * 0.8,
      this.height * 0.8
    );

    this._lifeBar = new LifeBar(scene, 0x00ff00, 100);

    // TODO: use container instead of changing each object's depth
    this.setDepth(5);
    this._lifeBar.setDepth(5);
  }

  update() {
    // move a life bar
    this._lifeBar.setPosition(
      this.x - this._lifeBar.boxWidth / 2,
      this.y + this.displayHeight / 2 + 10
    );

    // render a life bar
    this._lifeBar.renderLife(this.life / this.maxLife);
  }
}

export class BulletGroup extends Phaser.Physics.Arcade.Group {
  private width: number;
  private height: number;
  private hitWidth: number;
  private hitHeight: number;
  private isPaused = false;
  // private offsetX: number;
  // private offsetY: number;
  // private radius: number;

  constructor(scene: Phaser.Scene, private player: Shooter) {
    super(scene.physics.world, scene, {
      classType: Bullet,
      defaultKey: IMAGE_KEY.ENEMY_BULLET,
      maxSize: 300,
    });

    const { width, height } = scene.textures.get(IMAGE_KEY.ENEMY_BULLET)
      .source[0];
    this.width = width;
    this.height = height;
    this.hitWidth = width / 3;
    this.hitHeight = height / 3;
    // this.radius = Math.max(width, height) / 7;
    // this.offsetX = width / 2 - this.radius;
    // this.offsetY = height / 2 - this.radius;
  }

  update() {
    this.children.each(e => e.update());
  }

  public setBullet(count = 1) {
    for (let i = 0; i < count; i++) {
      if (this.isFull() || this.isPaused) return;
      // circle collision is too heavy
      (
        this.get(
          Phaser.Math.Between(-this.width, CANVAS_WIDTH),
          Phaser.Math.Between(-25 - this.height, 5 - this.height)
        ) as Bullet
      )
        .setVelocityY(Phaser.Math.Between(150, 250))
        .setBodySize(this.hitWidth, this.hitHeight)
        // .setCircle(this.radius, this.offsetX, this.offsetY)
        .refreshBody()
        .setScale(2.5);
    }
  }

  public pauseAllBullets() {
    this.isPaused = true;
    this.children.each(e => (e as Bullet).pauseBullet());
  }

  public resumeAllBullets() {
    this.isPaused = false;
    this.children.each(e => (e as Bullet).resumeBullet());
  }

  public destroyAllBullets() {
    this.children.each(e => (e as Bullet).destroy());
  }
}
