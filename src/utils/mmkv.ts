import { createMMKV, MMKV, useMMKVString } from 'react-native-mmkv';
import { MemoryItem } from '../types';
import { useMemo } from 'react';

/**
 * MMKV instance for the app
 */
export const storage: MMKV = createMMKV({
  id: 'memorygraph-storage',
  encryptionKey: 'some-secure-key-here', // In a real app, use a more secure way to manage keys
});

const KEYS = {
  MEMORIES: 'app.memories',
  USER_DATA: 'app.user_data',
  SETTINGS: 'app.settings',
};

/**
 * Memory related methods
 */
export const memoryStorage = {
  /**
   * Save a memory item. If it exists, updates it.
   */
  saveMemory: (memory: MemoryItem): void => {
    try {
      const memories = memoryStorage.getMemories();
      const existingIndex = memories.findIndex((m) => m.id === memory.id);

      if (existingIndex >= 0) {
        memories[existingIndex] = memory;
      } else {
        memories.unshift(memory); // Add to beginning of list
      }

      storage.set(KEYS.MEMORIES, JSON.stringify(memories));
    } catch (error) {
      console.error('Error saving memory to storage:', error);
    }
  },

  /**
   * Get a specific memory by ID
   */
  getMemoryById: (id: string): MemoryItem | undefined => {
    const memories = memoryStorage.getMemories();
    return memories.find((m) => m.id === id);
  },

  /**
   * Get all stored memories
   */
  getMemories: (): MemoryItem[] => {
    const memoriesJson = storage.getString(KEYS.MEMORIES);
    if (!memoriesJson) return [];

    try {
      const memories = JSON.parse(memoriesJson);
      // Convert timestamp strings back to Date objects
      return memories.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
    } catch (error) {
      console.error('Error parsing memories from storage:', error);
      return [];
    }
  },

  /**
   * Delete a specific memory by ID
   */
  deleteMemory: (id: string): void => {
    const memories = memoryStorage.getMemories();
    const filteredMemories = memories.filter((m) => m.id !== id);
    storage.set(KEYS.MEMORIES, JSON.stringify(filteredMemories));
  },

  /**
   * Clear all memories
   */
  clearMemories: (): void => {
    storage.remove(KEYS.MEMORIES);
  },
};

/**
 * Custom hook for reactive memory access
 */
export const useMemories = () => {
  const [memoriesJson] = useMMKVString(KEYS.MEMORIES, storage);

  const memories = useMemo(() => {
    if (!memoriesJson) return [];
    try {
      const parsed = JSON.parse(memoriesJson);
      return parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })) as MemoryItem[];
    } catch (e) {
      return [];
    }
  }, [memoriesJson]);

  return memories;
};

/**
 * User related methods
 */
export const userStorage = {
  setUserData: (data: any): void => {
    storage.set(KEYS.USER_DATA, JSON.stringify(data));
  },

  getUserData: (): any | null => {
    const dataJson = storage.getString(KEYS.USER_DATA);
    if (!dataJson) return null;
    try {
      return JSON.parse(dataJson);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  clearUserData: (): void => {
    storage.remove(KEYS.USER_DATA);
  },
};

/**
 * General cleanup
 */
export const cleanAllStorage = (): void => {
  storage.clearAll();
};
