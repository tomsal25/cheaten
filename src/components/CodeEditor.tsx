import { FunctionComponent, JSX } from 'preact/compat';

import { isPositiveInt } from '../util/Validate';

export const CodeEditor: FunctionComponent<{
  text: string;
  setText: (str: string) => void;
}> = ({ text, setText }) => {
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
          backgroundColor: '#2d333879',
          letterSpacing: '0.5px',
          // transform: 'translate(0px,-300px)',
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
