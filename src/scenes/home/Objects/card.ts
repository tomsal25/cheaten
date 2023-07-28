import Phaser from 'phaser';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../../config/Consts';

export class Card extends Phaser.GameObjects.Rectangle {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    title: string,
    onClick: () => void
  ) {
    // cards' config
    const width = (CANVAS_WIDTH * 4) / 18;
    const height = (CANVAS_HEIGHT * 3) / 14;
    const bgColor = 0xa6b946;

    super(scene, x, y, width, height, bgColor);
    this.setInteractive().once('pointerdown', onClick);

    scene.add.existing(this);

    const margin = 10;
    scene.add
      .text(x - width / 2 + margin, y - height / 2 + margin, id)
      .setColor('#111')
      .setFontSize(CANVAS_WIDTH / 20);

    scene.add
      .text(x, y + height / 2 - margin, title)
      .setColor('#111')
      .setFontSize(CANVAS_WIDTH / 20)
      .setOrigin(0.5, 1);
  }
}
