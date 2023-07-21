import { DEBUG_PREACT_DEBUG } from './config/Debug';
if (DEBUG_PREACT_DEBUG) {
  // @ts-expect-error 7016
  import('preact/debug');
}

import { render } from 'preact';
import { App } from './app';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
render(<App />, document.getElementById('app')!);
