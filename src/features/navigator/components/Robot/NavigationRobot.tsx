import { CSSProperties } from 'preact/compat';
import styles from './NavigationRobot.module.scss';

const width = 40;
const height = 40;

export const NavigationRobot = ({
  top,
  left,
  style,
}: {
  top: string | null;
  left: string | null;
  style?: CSSProperties;
}) => {
  return (
    <div
      className={styles.box}
      style={{
        transform:
          top && left
            ? `translate(calc(${top} - ${width / 2}px), calc(${left} - ${
                height / 2
              }px))`
            : null,
        ...style,
      }}
    >
      <div className={styles.robot} />
    </div>
  );
};
