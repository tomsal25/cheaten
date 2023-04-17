import Phaser from 'phaser';

export abstract class BaseShooter extends Phaser.Physics.Arcade.Image {
  protected _life = 0;
  protected _maxLife = 0;

  public get life() {
    return this._life;
  }

  public setNewLife(life: number) {
    this._life = life;
    this._maxLife = life;
  }

  public get maxLife() {
    return this._maxLife;
  }

  public decreaseLife(damage = 1) {
    this._life = Math.max(0, this.life - damage);
  }
}
