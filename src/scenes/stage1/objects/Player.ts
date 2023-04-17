import Phaser from 'phaser';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../../config/Consts';
import * as IMAGE_KEY from '../../../config/ImageKeyStore';
import { BaseShooter } from '../../base/BaseShooter';
import { Bullet } from '../../base/Bullet';
import { LifeBar } from '../../base/LifeBar';

let isMovable = false;

export class Shooter extends BaseShooter {
  private targetX = CANVAS_WIDTH / 2;
  private targetY = (CANVAS_HEIGHT * 3) / 5;
  private _lifeBar: LifeBar;

  constructor(scene: Phaser.Scene) {
    super(scene, CANVAS_WIDTH / 2, (CANVAS_HEIGHT * 3) / 5, IMAGE_KEY.SHIP);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.8).setCollideWorldBounds(true);
    isMovable = true;

    this._lifeBar = new LifeBar(scene, 0x00ff00, 100);
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

    // move a life bar
    this._lifeBar.setPosition(
      this.x - this._lifeBar.boxWidth / 2,
      this.y + this.displayHeight / 2 + 10
    );

    // render a life bar
    this._lifeBar.renderLife(this.life / this.maxLife);
  }

  public pausePlayer() {
    isMovable = false;
  }

  public resumePlayer() {
    isMovable = true;
  }

  public resetPosition() {
    this.targetX = CANVAS_WIDTH / 2;
    this.targetY = (CANVAS_HEIGHT * 3) / 5;
  }

  public setNewLife(life: number) {
    super.setNewLife(life);

    const width = 50 + Math.log(1 + life * 0.001) * 300;
    const maxWidth = CANVAS_WIDTH * 0.9;

    this._lifeBar.setBoxWidth(Math.floor(Math.min(width, maxWidth)));
  }
}

export class BulletGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene, private player: Shooter) {
    super(scene.physics.world, scene, {
      classType: Bullet,
      defaultKey: IMAGE_KEY.BULLET,
      maxSize: 250,
    });
  }

  update() {
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
