import { Note, NoNote } from '@tonaljs/core';

export type NoteDef = {
  displayName: string;
  note: Note | NoNote;
  offset: number;
};

export type KeyboardNotes = {
  width: number;
  height: number;
  whites: NoteDef[];
  blacks: NoteDef[];
};
