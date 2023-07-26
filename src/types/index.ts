import { JSX } from 'preact/jsx-runtime';

type BuiltinPropsMap = JSX.IntrinsicElements;
export type BuiltinProps<K extends keyof BuiltinPropsMap> = BuiltinPropsMap[K];
