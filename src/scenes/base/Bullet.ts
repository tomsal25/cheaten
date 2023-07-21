import Phaser from 'phaser';

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config/Consts';

export class Bullet extends Phaser.Physics.Arcade.Image {
  private velocityX = 0;
  private velocityY = 0;

  update() {
    const { x, y } = this;
    if (y < -100 || y > CANVAS_HEIGHT + 100) {
      this.destroy();
      return;
    }
    if (x < -100 || x > CANVAS_WIDTH + 100) {
      this.destroy();
      return;
    }
  }

  public pauseBullet() {
    const { x, y } = this.body.velocity;
    this.velocityX = x;
    this.velocityY = y;
    this.setVelocity(0, 0);
  }

  public resumeBullet() {
    this.setVelocity(this.velocityX, this.velocityY);
  }
}
