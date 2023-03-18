import { CSSProperties, JSX } from 'preact/compat';

import { isPositiveInt } from '../util/Validate';

export const CodeEditor = ({
  text,
  setText,
  style,
}: {
  text: string;
  setText: (str: string) => void;
  style?: CSSProperties;
}) => {
  const validator = isPositiveInt;

  const typeHandler: JSX.GenericEventHandler<HTMLInputElement> = e => {
    const { value } = e.currentTarget;
    if (!validator(value)) {
      e.currentTarget.value = text;
      return;
    }
    setText(value);

    // special action
    // if (value === '111') e.currentTarget.blur();
  };

  return (
    <>
      <div
        id="code-editor"
        style={{
          letterSpacing: '0.5px',
          backgroundColor: '#2d3338',
          userSelect: 'text',
          ...style,
        }}
      >
        <span style={{ color: 'yellow' }}>const</span>
        <span> </span>
        <span style={{ color: 'springgreen' }}>myvar</span>
        <span> = </span>
        <input
          type="text"
          value={text}
          onInput={typeHandler}
          style={{
            width: `30px`,
            letterSpacing: '0.5px',
            color: 'lightcyan',
          }}
        />
        <span>;</span>
      </div>
    </>
  );
};
