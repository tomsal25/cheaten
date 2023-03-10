import { atom } from 'nanostores';
import { SCENE_KEY, SCENE_KEY_LIST } from '../config/KeyStore';

export const atomCount = atom(0);
export const atomFlag = atom(false);

export const currentSceneKey = atom<SCENE_KEY_LIST | null>(null);
currentSceneKey.listen(
  v =>
    import.meta.env.DEV &&
    v &&
    console.log(
      (Object.keys(SCENE_KEY) as (keyof typeof SCENE_KEY)[]).find(
        val => SCENE_KEY[val] === v
      )
    )
);
