import { atom } from 'nanostores';
import { SCENE_KEY, STAGE_KEY_LIST } from '../config/KeyStore';

export const g_count = atom(0);
export const g_isPlaying = atom(true);

export const g_currentSceneKey = atom<STAGE_KEY_LIST | null>(null);
if (DEBUG_DISPLAY_CURRENT_SCENE) {
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
