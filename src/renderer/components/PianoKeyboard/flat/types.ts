import { Note, NoNote } from '@tonaljs/core';

export type NoteDef = {
  displayName: string;
  note: Note | NoNote;
  offset: number;
  isBlack: boolean;
};

export type KeyboardNotes = {
  width: number;
  height: number;
  notes: NoteDef[];
};
