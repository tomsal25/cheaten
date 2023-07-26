export const clsx = (...args: (string | boolean | null | undefined)[]) => {
  // if className is false, remove it,
  // and strings will be passed normaly.
  return args.filter(className => !!className).join(' ');
};
