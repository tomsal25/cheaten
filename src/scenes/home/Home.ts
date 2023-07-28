import Phaser from 'phaser';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config/Consts';
import * as SCENE_KEY from '../../config/SceneKeyStore';
import { Card } from './Objects/card';

export class Home extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEY.HOME });
  }
  create() {
    // this menu's backgound
    this.add
      .rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0x9932cc)
      .setOrigin(0);

    // title
    this.add
      .text(CANVAS_WIDTH / 2, 100, 'SELECT STAGE')
      .setColor('#111')
      .setFontSize(CANVAS_WIDTH / 10)
      .setOrigin(0.5);

    const sceneDataList: [id: string, title: string, onClick: () => void][] = [
      [
        '1',
        'op',
        () => {
          import('../stage1/Stage1')
            .then(e => {
              this.game.scene.add(SCENE_KEY.STAGE1, e.default);
              this.scene.start(SCENE_KEY.STAGE1);
            })
            .catch(null);
        },
      ],
      [
        '2',
        '変数',
        () => {
          import('../stage2/Stage2')
            .then(e => {
              this.game.scene.add(SCENE_KEY.STAGE2, e.default);
              this.scene.start(SCENE_KEY.STAGE2);
            })
            .catch(null);
        },
      ],
    ];
    const element = sceneDataList.length;

    /**
     * Card ratio
     *
     *  2   4 1 4  1 4  2
     * 0  1111 1111 1111  0
     * 0  1111 1111 1111  0  3
     * 0  1111 1111 1111  0
     *                       1
     * 0  1111 1111 1111  0
     * 0  1111 1111 1111  0  3
     * 0  1111 1111 1111  0
     *                       1
     * 0  1111 1111 1111  0
     * 0  1111 1111 1111  0  3
     * 0  1111 1111 1111  0
     *
     */
    const x_limit = 3;
    const y_limit = 3;

    for (let y_index = 0; y_index < y_limit; y_index++) {
      for (let x_index = 0; x_index < x_limit; x_index++) {
        // current index of sceneDataList
        const current_index = x_index + y_index * x_limit;
        if (current_index >= element) break;

        const [id, title, onClick] = sceneDataList[current_index];
        new Card(
          this,
          (CANVAS_WIDTH * (4 + 5 * x_index)) / 18,
          (CANVAS_HEIGHT * (4 + 4 * y_index)) / 14,
          id,
          title,
          onClick
        );
      }
    }
  }
}
