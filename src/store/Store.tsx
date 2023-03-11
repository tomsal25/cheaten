import { atom } from 'nanostores';
import { SCENE_KEY, SCENE_KEY_LIST } from '../config/KeyStore';

export const g_count = atom(0);
export const g_isPlaying = atom(true);

export const g_currentSceneKey = atom<SCENE_KEY_LIST | null>(null);
if (import.meta.env.DEV) {
  g_currentSceneKey.listen(
    v =>
      v &&
      console.log(
        (Object.keys(SCENE_KEY) as (keyof typeof SCENE_KEY)[]).find(
          val => SCENE_KEY[val] === v
        )
      )
  );
}
