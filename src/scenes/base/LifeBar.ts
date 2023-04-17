import Phaser from 'phaser';

export class LifeBar extends Phaser.GameObjects.Container {
  private _lifeBarBox: Phaser.GameObjects.Graphics;
  private _boxWidth = 0;
  private _boxHeight = 20;

  private _lifeBar: Phaser.GameObjects.Graphics;
  private readonly _padding = 3;
  private _barWidth = 0;
  private _barHeight = this._boxHeight - this._padding * 2;

  constructor(scene: Phaser.Scene, private color: number, width: number) {
    super(scene);
    scene.add.existing(this);

    // render background and frame
    this._lifeBarBox = scene.add.graphics();
    this.setBoxWidth(width);

    this._lifeBar = scene.add.graphics();

    this.add([this._lifeBarBox, this._lifeBar]);
  }

  public get boxWidth() {
    return this._boxWidth;
  }

  public get boxHeight() {
    return this._boxHeight;
  }

  public setBoxWidth(width: number) {
    this._boxWidth = width;
    this._barWidth = this._boxWidth - this._padding * 2;

    this._lifeBarBox.clear();
    this._lifeBarBox
      .fillStyle(0x000000)
      .fillRect(0, 0, this._boxWidth, this._boxHeight)
      .fillStyle(0xffffff)
      .fillRect(this._padding, this._padding, this._barWidth, this._barHeight);
  }

  public renderLife(ratio: number) {
    const color = ratio > 0.3 ? this.color : 0xff0000;

    this._lifeBar.clear();
    this._lifeBar
      .fillStyle(color)
      .fillRect(
        this._padding,
        this._padding,
        this._barWidth * ratio,
        this._barHeight
      );
  }
}
