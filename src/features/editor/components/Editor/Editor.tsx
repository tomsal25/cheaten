import { useStore } from '@nanostores/preact';
import { WritableAtom } from 'nanostores';
import { useEffect, useRef } from 'preact/hooks';
import {
  g_codeString,
  g_componentInfoList,
  g_currentScreen,
  g_inputValueList,
  g_isInputEnabled,
  g_isSubmitted,
  g_targetScrollPos,
} from '../../../../store/Store';
import { CodeParser } from '../Parser/CodeParser';
import styles from './Editor.module.scss';

const SubmitButton = ({ isEnabled }: { isEnabled: WritableAtom<boolean> }) => {
  const flag = useStore(isEnabled);

  const checkInputValue = () => {
    isEnabled.set(false);
    const infoList = g_componentInfoList.get();
    if (!infoList) return;
    g_inputValueList.set(infoList.map(e => e.getValue()));
    g_isSubmitted.set(true);
  };

  return (
    <button
      disabled={!flag}
      onClick={checkInputValue}
      style={{ position: 'absolute', top: 20, right: 30, zIndex: 1 }}
    >
      {flag ? 'Run' : 'Lock'}
    </button>
  );
};

export const Editor = ({ zIndex }: { zIndex: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return g_targetScrollPos.listen(([, y]) => {
      ref.current?.scroll({ top: y - 120, behavior: 'smooth' });
    });
  }, []);

  const isSelectEditor = useStore(g_currentScreen) == 'editor';
  const codeString = useStore(g_codeString);

  return (
    <div
      className={styles.box}
      style={{
        zIndex,
        transform: `${isSelectEditor ? '' : 'scale(0)'}`,
        transition: `transform ${isSelectEditor ? '1s' : '.5s'} ease`,
      }}
    >
      <div className={styles.wrapper}>
        {/* TODO: consider using position:sticky */}
        <SubmitButton isEnabled={g_isInputEnabled} />
        <div
          ref={ref}
          className={styles.editor}
          style={{ userSelect: isSelectEditor ? 'text' : 'none' }}
        >
          <CodeParser codeString={codeString} isEnabled={g_isInputEnabled} />
        </div>
      </div>
    </div>
  );
};
