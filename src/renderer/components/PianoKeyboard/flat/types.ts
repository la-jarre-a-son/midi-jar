import { Note, NoNote } from '@tonaljs/core';

export type NoteDef = {
  displayName: string;
  note: Note | NoNote;
  offset: number;
  labelOffset: number;
  isBlack: boolean;
};

export type KeyboardKeys = {
  width: number;
  height: number;
  notes: NoteDef[];
};
