import { render } from 'preact';
if (import.meta.env.DEV) {
  // @ts-expect-error 7016
  import('preact/debug');
}

import { App } from './app';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<App />, document.getElementById('app')!);
