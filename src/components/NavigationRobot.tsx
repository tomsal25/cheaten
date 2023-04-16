import { CSSProperties } from 'preact/compat';

import './NavigationRobot.css';

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
      className="navi-box"
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
      <div className="navi-robot" />
    </div>
  );
};
