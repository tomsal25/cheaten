import Phaser from 'phaser';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config/Consts';
import {
  DEBUG_CHECK_DUPLICATE_EVENT,
  DEBUG_CHECK_ISMOVE,
  DEBUG_DISPLAY_INFO,
  DEBUG_g_isMove,
} from '../../config/Debug';
import * as IMAGE_KEY from '../../config/ImageKeyStore';
import * as SCENE_KEY from '../../config/SceneKeyStore';
import {
  g_codeString,
  g_componentInfoList,
  g_currentSceneKey,
  g_currentScreen,
  g_flag,
  g_isInputEnabled,
  g_isSubmitted,
  g_targetPosition,
  g_targetScrollPos,
  setGlobalFlag,
  setTimelineList,
  setWaitFlag,
  stepTimeline,
} from '../../store/Store';
import { isPositiveInt } from '../../util/Validate';
import { getCodeString } from './data/CodeString';
import { timeline } from './data/Timeline';
import * as Enemy from './objects/Enemy';
import * as Player from './objects/Player';

export class Stage1 extends Phaser.Scene {
  private flag = 1;
  private isMove = true;

  private enemy!: Enemy.Shooter;
  private enemyWeapon!: Enemy.BulletGroup;
  private player!: Player.Shooter;
  private playerWeapon!: Player.BulletGroup;

  private clearText!: Phaser.GameObjects.Text;

  private colliderList: Phaser.Physics.Arcade.Collider[] = [];
  private enemyAttackEvent: Phaser.Time.TimerEvent | null = null;

  constructor() {
    super({ key: SCENE_KEY.STAGE1 });
  }

  create() {
    // background
    this.add.image(400, 500, IMAGE_KEY.SKY_BG);

    // FIXME: if scene made twice, throw error: physics doesn't exist
    this.enemy = new Enemy.Shooter(this);
    this.enemyWeapon = new Enemy.BulletGroup(this, this.enemy);
    this.player = new Player.Shooter(this);
    this.playerWeapon = new Player.BulletGroup(this, this.player);

    // debug text
    if (DEBUG_DISPLAY_INFO) {
      const text = this.add
        .text(0, 0, '', { fontSize: '50px', color: '#ff0' })
        .setDepth(10);

      this.events.on('update', () => {
        text.setText([
          `Player: ${this.player.life}/${this.player.maxLife}`,
          `  Weapon:${this.playerWeapon.countActive()}`,
          `Enemy: ${this.enemy.life}/${this.enemy.maxLife}`,
          `  Weapon:${this.enemyWeapon.countActive()}`,
          `fps: ${this.game.loop.actualFps}`,
        ]);
      });
    }

    // clear screen
    this.clearText = this.add
      .text(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '', {
        fontSize: '80px',
        color: '#ff0',
      })
      .setOrigin()
      .setDepth(10);

    this.pauseMovement();

    g_codeString.set(getCodeString());

    setTimelineList(timeline);
    g_currentSceneKey.set(SCENE_KEY.STAGE1);
  }

  update() {
    // update objects
    this.player.update();
    this.playerWeapon.update();
    this.enemy.update();
    this.enemyWeapon.update();

    // both local flag and global flag must be the same
    if (this.flag != g_flag.get()) this.flag = g_flag.get();

    // impossible settings
    if (this.flag == 1) {
      setWaitFlag();
      this.resetScreen();
      this.setEnemyAttack();
      this.player.setNewLife(100);
      this.enemy.setNewLife(15000);

      stepTimeline();
    }
    // start the game
    else if (this.flag == 2) {
      this.resumeMovement();

      stepTimeline();
    }
    // wait until player killed
    else if (this.flag == 3) {
      if (this.player.life == 0) {
        this.pauseMovement();

        setWaitFlag();
        stepTimeline();
      }
    }
    // go to the editor
    else if (this.flag == 4) {
      setWaitFlag();
      g_currentScreen.set('editor');

      stepTimeline();
    }
    // explain the system
    else if (this.flag == 5) {
      setWaitFlag();
      const inputInfo = g_componentInfoList.get()?.[0];
      if (!inputInfo) {
        if (import.meta.env.DEV) throw new Error('input is not set properly.');
        return;
      }
      g_targetScrollPos.set([inputInfo.getOffsetX(), inputInfo.getOffsetY()]);
      setTimeout(() => {
        const { x, y, width, height } = inputInfo.getDomRect();
        // set the navi above the input
        g_targetPosition.set([x + width / 2, y - height]);
      }, 800);

      stepTimeline();
    }
    // wait until submit
    else if (this.flag == 6) {
      // do this in case coming back from a later flag
      g_currentScreen.set('editor');
      setWaitFlag();
      g_isInputEnabled.set(true);
      stepTimeline();
    }
    // wait until submit
    else if (this.flag == 7) {
      if (g_isSubmitted.get()) {
        g_isSubmitted.set(false);
        setWaitFlag();

        const inputInfo = g_componentInfoList.get()?.[0];
        if (!inputInfo) {
          if (import.meta.env.DEV)
            throw new Error('input is not set properly.');
          return;
        }

        // if value is not a number, retry this event
        const value = inputInfo.getValue();
        if (!isPositiveInt(value)) {
          stepTimeline();
          return;
        }

        // set new life and new game
        const num = parseInt(value, 10);

        if (num == 0) {
          stepTimeline();
          return;
        }

        this.resetScreen();
        this.setEnemyAttack();
        this.player.setNewLife(Number.isFinite(num) && num < 1e4 ? num : 1e4);
        this.enemy.setNewLife(15000);
        this.stepFlag(9);
      }
    }
    // retry input event
    else if (this.flag == 8) {
      this.stepFlag(7);
      g_isInputEnabled.set(true);
    }
    // return game screen
    else if (this.flag == 9) {
      g_currentScreen.set('game');
      setTimeout(() => this.resumeMovement(), 1000);
      stepTimeline();
    }
    // wait player or enemy killed
    else if (this.flag == 10) {
      if (this.player.life == 0) {
        this.pauseMovement();

        setWaitFlag();
        stepTimeline();
      } else if (this.enemy.life == 0) {
        this.stepFlag(12);
      }
    }
    // retry
    else if (this.flag == 11) {
      this.stepFlag(6);
    }
    // game clear
    else if (this.flag == 12) {
      this.player.pausePlayer();
      this.destoryCollider();
      this.removeAttackEvent();
      this.clearText.setText('STAGE CLEAR!!!');
      setWaitFlag();
    }
  }

  private setEnemyAttack() {
    if (DEBUG_CHECK_DUPLICATE_EVENT && this.enemyAttackEvent)
      throw new Error('duplicate event');

    this.enemyAttackEvent = this.time.addEvent({
      delay: 700,
      callback: () => this.enemyWeapon.setBullet(20),
      loop: true,
    });
  }

  private removeAttackEvent() {
    this.enemyAttackEvent?.remove();
    if (DEBUG_CHECK_DUPLICATE_EVENT) this.enemyAttackEvent = null;
  }

  private setCollider() {
    this.colliderList = [
      this.physics.add.overlap(this.playerWeapon, this.enemy, () => {
        this.enemy.decreaseLife();
      }),
      this.physics.add.overlap(this.player, this.enemyWeapon, () => {
        this.player.decreaseLife();
      }),
      this.physics.add.overlap(this.player, this.enemy, () => {
        this.player.decreaseLife();
      }),
    ];
  }

  private destoryCollider() {
    this.colliderList.forEach(collider => collider.destroy());
    this.colliderList = [];
  }

  private pauseMovement() {
    if (!this.isMove) return;
    this.isMove = false;
    if (DEBUG_CHECK_ISMOVE) DEBUG_g_isMove.set(false);

    this.player.pausePlayer();
    this.playerWeapon.pauseAllBullets();
    this.enemyWeapon.pauseAllBullets();
    this.destoryCollider();
  }

  private resumeMovement() {
    if (this.isMove) return;
    this.isMove = true;
    if (DEBUG_CHECK_ISMOVE) DEBUG_g_isMove.set(true);

    this.player.resumePlayer();
    this.playerWeapon.resumeAllBullets();
    this.enemyWeapon.resumeAllBullets();
    this.setCollider();
  }

  private resetScreen() {
    this.player.resetPosition();
    this.playerWeapon.destroyAllBullets();
    this.enemyWeapon.destroyAllBullets();
    this.removeAttackEvent();
  }

  private stepFlag(flag: number) {
    this.flag = flag;
    setGlobalFlag(flag);
  }
}
