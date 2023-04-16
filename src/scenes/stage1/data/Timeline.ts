import { TimelineList } from '../../../store/Store';

export const timeline: TimelineList = [
  { type: 'flag', flag: 1 },
  { type: 'navistart' },
  {
    type: 'navi',
    text: ['ようこそCheatenの世界へ！', '今からゲームをしてもらいます。'],
  },
  { type: 'naviend' },
  { type: 'flag', flag: 2 },
  { type: 'flag', flag: 3 },
  { type: 'navistart' },
  {
    type: 'navi',
    text: [
      'ゲームオーバー！',
      '......',
      '............',
      'え？体力がないからクリアできないって？',
      'それなら......',
    ],
  },
  { type: 'naviend' },
  { type: 'flag', flag: 4 },
  { type: 'navistart' },
  {
    type: 'navi',
    text: ['「チート」を使おう！'],
  },
  { type: 'flag', flag: 5 },
  {
    type: 'navi',
    text: [
      'ここに好きな数を入れてね。',
      '入力したら、右上のRunボタンを押してね。',
    ],
  },
  { type: 'flag', flag: 6 },
  { type: 'naviend' },
  { type: 'flag', flag: 7 },
  { type: 'navistart' },
  {
    type: 'navi',
    text: ['数を入力してね。'],
  },
  { type: 'naviend' },
  { type: 'flag', flag: 8 },
  { type: 'flag', flag: 9 },
  { type: 'flag', flag: 10 },
  { type: 'navistart' },
  {
    type: 'navi',
    text: ['もう一度挑戦しよう！'],
  },
  { type: 'naviend' },
  { type: 'flag', flag: 11 },
  { type: 'flag', flag: 12 },
];
