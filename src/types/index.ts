/**
 * Type definitions for the app
 */

export type MemoryItemType = 'note' | 'link' | 'image' | 'file';

export interface MemoryItem {
  id: string;
  type: MemoryItemType;
  title: string;
  content: string;
  tags: string[];
  timestamp: Date;
  preview?: string;
  url?: string;
}

export type TabName = 'home' | 'search' | 'add' | 'profile';
