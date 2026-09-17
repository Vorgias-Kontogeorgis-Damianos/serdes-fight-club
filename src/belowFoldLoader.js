let belowFoldPromise;

export function loadBelowFold() {
  belowFoldPromise ||= import('./BelowFoldSections.jsx');
  return belowFoldPromise;
}
