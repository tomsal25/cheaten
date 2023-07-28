import { useStore } from '@nanostores/preact';
import { ReadableAtom } from 'nanostores';
import { useEffect, useRef } from 'preact/hooks';
import styles from './CustomInput.module.scss';

export interface InputInfo {
  getValue: () => string;
  getDomRect: () => DOMRect;
  getOffsetX: () => number;
  getOffsetY: () => number;
}

export const CustomInput = ({
  infoSetter,
  isEnabled,
  initText,
}: {
  infoSetter: (info: InputInfo) => void;
  isEnabled: ReadableAtom<boolean>;
  initText?: string;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const isDisabled = !useStore(isEnabled);
  console.log('parse', infoSetter, initText);

  useEffect(() => {
    console.log('ueparse', infoSetter);

    infoSetter({
      getValue: () => ref.current?.value ?? '',
      getDomRect: () => ref.current?.getBoundingClientRect() ?? new DOMRect(),
      getOffsetX: () => ref.current?.offsetLeft ?? 0,
      getOffsetY: () => ref.current?.offsetTop ?? 0,
    });
  }, [infoSetter]);

  return (
    <input
      className={styles.input}
      ref={ref}
      type="text"
      disabled={isDisabled}
      defaultValue={initText}
    />
  );
};
