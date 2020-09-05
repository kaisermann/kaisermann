export function isValidHotkey(e) {
  return (
    document.activeElement === document.body ||
    document.activeElement == null ||
    (document.activeElement.tagName === 'BUTTON' &&
      e.key !== 'Enter' &&
      e.key !== ' ')
  );
}
