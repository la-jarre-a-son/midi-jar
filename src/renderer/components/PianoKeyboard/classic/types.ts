import { Note, NoNote } from '@tonaljs/core';

export type NoteDef = {
  displayName: string;
  note: Note | NoNote;
  offset: number;
  labelOffset: number;
};

export type KeyboardKeys = {
  width: number;
  height: number;
  whites: NoteDef[];
  blacks: NoteDef[];
  labels: NoteDef[];
};
