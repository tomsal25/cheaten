import { TimelineList } from '../../../store/Store';

export const timeline: TimelineList = [
  { type: 'flag', flag: 1 },
  { type: 'navistart' },
  {
    type: 'navi',
    text: [
      'Cheatenを遊んでくれてありがとう！',
      'ところでどうして体力が増えたのかな？',
      'それは......',
    ],
  },
  { type: 'flag', flag: 2 },
  {
    type: 'navi',
    text: [
      'この「プログラミング」が関係しているんだ。',
      '難しそうに見えるけど、よく読めば必要なことは書いてあるから安心してね。',
    ],
  },
  { type: 'flag', flag: 3 },
  {
    type: 'navi',
    text: [
      '例えば、ここ！',
      'どうやらこの「this.life」が敵の体力を表すみたいだね。',
      'それじゃあ今度は敵の体力を変えてみよう！',
    ],
  },
  { type: 'naviend' },
  { type: 'flag', flag: 4 },
  { type: 'flag', flag: 5 },
  { type: 'navistart' },
  {
    type: 'navi',
    text: ['0以上の数を入力してね。'],
  },
  { type: 'naviend' },
  { type: 'flag', flag: 6 },
  { type: 'flag', flag: 7 },
  { type: 'flag', flag: 8 },
  { type: 'navistart' },
  {
    type: 'navi',
    text: ['もう一度挑戦しよう！'],
  },
  { type: 'naviend' },
  { type: 'flag', flag: 9 },
  { type: 'flag', flag: 10 },
  { type: 'navistart' },
  {
    type: 'navi',
    text: [
      'お見事！',
      'ちなみに「値を保存するモノ」のことを「変数」と呼ぶよ！',
    ],
  },
  { type: 'naviend' },
  { type: 'flag', flag: 11 },
];
