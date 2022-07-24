import { Note, NoNote } from '@tonaljs/core';

export type NoteDef = {
  note: Note | NoNote;
  offset: number;
};

export type KeyboardNotes = {
  width: number;
  height: number;
  whites: NoteDef[];
  blacks: NoteDef[];
};
