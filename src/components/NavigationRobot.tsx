import { CSSProperties } from 'preact/compat';
import favsrc from '../assets/favicon.svg';

export const NavigationRobot = ({
  top,
  left,
  style,
}: {
  top: string;
  left: string;
  style?: CSSProperties;
}) => {
  const width = 40;
  const height = 40;
  const x = `calc(${top} - ${width / 2}px)`;
  const y = `calc(${left} - ${height / 2}px)`;

  return (
    <div
      style={{
        width,
        height,
        top: 0,
        left: 0,
        transform: `translate(${x}, ${y})`,
        position: 'fixed',
        ...style,
      }}
    >
      <style>
        {`@keyframes loop {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
          100% {
            transform: translateY(0);
          }
        }`}
      </style>
      <div
        style={{
          width: '100%',
          height: '100%',
          animationName: 'loop',
          animationDuration: '2s',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate',
          animationTimingFunction: 'ease-in-out',
          backgroundImage: `url('${favsrc}')`,
        }}
      />
    </div>
  );
};
