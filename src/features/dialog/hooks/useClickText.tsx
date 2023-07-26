import { Ref, useEffect, useState } from 'preact/hooks';

export const useClickText = (
  text: readonly string[],
  setFinishRead: () => void,
  dialogRef: Ref<HTMLDivElement>,
  initialPage = 0
) => {
  const [page, setPage] = useState(initialPage);
  const lastPage = text.length - 1;
  if (page > lastPage) setFinishRead();

  // on click
  useEffect(() => {
    const current = dialogRef.current;
    if (!current) return;
    const turnPage = () => setPage(p => p + 1);
    current.addEventListener('click', turnPage);
    return () => current.removeEventListener('click', turnPage);
  }, [text, dialogRef]);

  return page < lastPage ? text[page] : text[lastPage];
};
