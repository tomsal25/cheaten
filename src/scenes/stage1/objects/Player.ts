import Phaser from 'phaser';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../../config/Consts';
import * as IMAGE_KEY from '../../../config/ImageKeyStore';
import { BaseShooter } from '../../base/BaseShooter';
import { Bullet } from '../../base/Bullet';

let isMovable = false;

export class Shooter extends BaseShooter {
  private targetX = 400;
  private targetY = 600;
  // private _lifeBar: LifeBar;

  constructor(scene: Phaser.Scene) {
    super(scene, CANVAS_WIDTH / 2, (CANVAS_HEIGHT * 3) / 5, IMAGE_KEY.SHIP);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.8).setCollideWorldBounds(true);
    isMovable = true;

    this.setLife(100);

    // this._lifeBar = new LifeBar(scene, 0xff0000);
  }

  update() {
    // move character
    if (isMovable && this.scene.input.activePointer.isDown) {
      const { x, y, worldX, worldY } = this.scene.input.activePointer;
      // return if out of screen
      if (y < 0 || y > CANVAS_HEIGHT) return;
      if (x < 0 || x > CANVAS_WIDTH) return;
      this.targetX = worldX;
      this.targetY = worldY;
    }
    // chase pointer
    this.scene.physics.moveTo(this, this.targetX, this.targetY, 400, 50);
  }

  public pausePlayer() {
    isMovable = false;
  }

  public resumePlayer() {
    isMovable = true;
  }

  public resetPosition() {
    this.targetX = 400;
    this.targetY = 600;
  }
}

export class BulletGroup extends Phaser.Physics.Arcade.Group {
  private elapsedTime = 0;

  constructor(scene: Phaser.Scene, private player: Shooter) {
    super(scene.physics.world, scene, {
      classType: Bullet,
      defaultKey: IMAGE_KEY.BULLET,
      maxSize: 250,
    });
  }

  update(t: number, dt: number) {
    this.elapsedTime += dt;
    if (this.elapsedTime >= 3000) {
      // console.log('3000ms経過');
      this.elapsedTime %= 3000;
    }
    this.children.each(e => e.update());
    // FIXME: on smartphone, moving finger while touching the canvas causes odd player speed
    if (isMovable && this.scene.input.activePointer.isDown) {
      const { x, y } = this.scene.input.activePointer;
      // return if out of screen
      if (y < 0 || y > CANVAS_HEIGHT) return;
      if (x < 0 || x > CANVAS_WIDTH) return;
      this.fireBullet();
    }
  }

  private fireBullet(count = 1) {
    for (let i = 0; i < count; i++) {
      if (this.isFull()) return;
      (this.get(this.player.x, this.player.y) as Bullet).setVelocityY(-300);
    }
  }

  public pauseAllBullets() {
    this.children.each(e => (e as Bullet).pauseBullet());
  }

  public resumeAllBullets() {
    this.children.each(e => (e as Bullet).resumeBullet());
  }

  public destroyAllBullets() {
    this.children.each(e => (e as Bullet).destroy());
  }
}
