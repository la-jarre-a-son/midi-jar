export type WindowState = {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
  maximized: boolean;
  alwaysOnTop: boolean;
  changelogDismissed: boolean;
  updateDismissed: string | null;
  path: string;
};
