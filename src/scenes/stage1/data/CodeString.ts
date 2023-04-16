export const getCodeString = () =>
  `
class Enemy {
  constructor(x, y) {
    // 敵の位置
    this.x = x;
    this.y = y;
    // 敵の体力
    this.life = 20000;
    // 敵の体力(MAX)
    this.maxLife = this.life;
    // 敵の攻撃力
    this.attack = 1;
  }

  // 体力の設定
  setLife(life) {
    this.life = life;
    this.maxLife = life;
  }

  // 位置の設定
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  // 体力を１減らす。
  takeDamage() {
    this.life = this.life - 1;
  }
}

class Player {
  constructor(x, y) {
    // プレイヤーの位置
    this.x = x;
    this.y = y;
    // プレイヤーの体力
    this.life = /*@t:100@*/;
    // プレイヤーの体力(MAX)
    this.maxLife = this.life;
    // プレイヤーの攻撃力
    this.attack = 1;
  }

  // 体力の設定
  setLife(life) {
    this.life = life;
    this.maxLife = life;
  }

  // 位置の設定
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  // 体力を１減らす。
  takeDamage() {
    this.life = this.life - 1;
  }
}
`.trim();
