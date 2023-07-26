import { BuiltinProps } from '../../../../types';
import styles from './StartButton.module.scss';

type Props = BuiltinProps<'button'>;

export const StartButton = ({ onClick }: Props) => {
  return (
    <button className={styles.btn} onClick={onClick}>
      Let's Start!
    </button>
  );
};
