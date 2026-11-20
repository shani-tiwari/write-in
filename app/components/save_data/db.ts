import Dexie, { type Table } from 'dexie';

export interface Entry {
  id?: number;
  text: string;
  translated: string;
  createdAt: Date;
}

export class WriteInDatabase extends Dexie {
  entries!: Table<Entry, number>;

  constructor() {
    super('write_in_db');
    this.version(1).stores({
      entries: '++id, createdAt'
    });
  }
}

// Database instance
export const db = new WriteInDatabase();

/**
 * Save an entry to IndexedDB.
 * Accepts text and translated, generates createdAt timestamp, and saves the entry.
 * Returns the auto-incremented id of the saved entry.
 */
export async function saveEntry(text: string, translated: string): Promise<number> {
  const createdAt = new Date();
  const id = await db.entries.add({
    text,
    translated,
    createdAt
  });
  return id as number;
}

/**
 * Retrieve all saved entries from IndexedDB, sorted by most recent first.
 */
export async function fetchEntries(): Promise<Entry[]> {
  try {
    const entries = await db.entries.orderBy('createdAt').reverse().toArray();
    return entries;
  } catch (error) {
    console.warn("Falling back to in-memory sort for fetchEntries:", error);
    const entries = await db.entries.toArray();
    return entries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

/**
 * Retrieve an entry using its unique id.
 * Handles both number and string inputs; returns undefined if id is invalid or not found.
 */
export async function fetchSingleEntry(id: number | string): Promise<Entry | undefined> {
  const numericId = typeof id === 'number' ? id : parseInt(id, 10);
  if (isNaN(numericId) || numericId <= 0) {
    return undefined;
  }
  return await db.entries.get(numericId);
}

/**
 * Delete an entry using its unique id.
 */
export async function deleteEntry(id: number | string): Promise<void> {
  const numericId = typeof id === 'number' ? id : parseInt(id, 10);
  if (isNaN(numericId) || numericId <= 0) {
    return;
  }
  await db.entries.delete(numericId);
}

/**
 * Format a Date object or timestamp into a readable date string.
 */
export function formatEntryDate(date: Date | string | number): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return '';
  }
}

// Convenient aliases
export const getEntries = fetchEntries;
export const getAllEntries = fetchEntries;
export const getEntryById = fetchSingleEntry;
export const fetchEntryById = fetchSingleEntry;
