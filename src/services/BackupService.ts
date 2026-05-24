import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { storage } from '../utils/mmkv';
import { Alert } from 'react-native';

const BACKUP_FILE_NAME = 'memorygraph_backup.json';

/**
 * Service for importing and exporting app data
 */
export const BackupService = {
  /**
   * Export all stored data to a JSON file and open the share sheet
   */
  exportData: async () => {
    try {
      // Get all keys from MMKV
      const allKeys = storage.getAllKeys();
      const backupData: Record<string, any> = {};

      allKeys.forEach((key) => {
        const value = storage.getString(key);
        if (value) {
          try {
            backupData[key] = JSON.parse(value);
          } catch {
            backupData[key] = value;
          }
        }
      });

      const jsonString = JSON.stringify(backupData, null, 2);

      // Use the standard FileSystem API for SDK 54
      if (!FileSystem.documentDirectory) {
        throw new Error('Could not determine document directory');
      }

      const fileUri = `${FileSystem.documentDirectory}${BACKUP_FILE_NAME}`;

      // Write to temporary file
      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      // Open share sheet
      // On Android, Sharing.shareAsync often doesn't show "Save to Files" directly
      // However, we can use the 'Storage Access Framework' (SAF) or similar if needed.
      // For now, we will use Sharing.shareAsync which includes "Save to drive/files" in most modern Android/iOS systems.
      // To make it more prominent, we ensure the mimeType is correct.
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export MemoryGraph Data',
        UTI: 'public.json', // Required for iOS to show "Save to Files"
      });
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Export Failed', 'An error occurred while exporting your data.');
    }
  },

  /**
   * Save data directly to a user-selected directory (Android SAF)
   * This provides a better "Save to Device" experience
   */
  saveToDevice: async () => {
    try {
      // Get all keys from MMKV
      const allKeys = storage.getAllKeys();
      const backupData: Record<string, any> = {};

      allKeys.forEach((key) => {
        const value = storage.getString(key);
        if (value) {
          try {
            backupData[key] = JSON.parse(value);
          } catch {
            backupData[key] = value;
          }
        }
      });

      const jsonString = JSON.stringify(backupData, null, 2);

      // On Android, we can use Storage Access Framework to let user pick a folder
      // On iOS, we stick with shareAsync as it's the standard "Save to Files" way
      if (FileSystem.StorageAccessFramework) {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            BACKUP_FILE_NAME,
            'application/json'
          );

          await FileSystem.writeAsStringAsync(fileUri, jsonString, {
            encoding: FileSystem.EncodingType.UTF8,
          });

          Alert.alert('Success', 'Backup saved successfully to your device!');
        }
      } else {
        // Fallback to sharing for iOS or if SAF is not available
        const fileUri = `${FileSystem.documentDirectory}${BACKUP_FILE_NAME}`;
        await FileSystem.writeAsStringAsync(fileUri, jsonString, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Save MemoryGraph Backup',
          UTI: 'public.json',
        });
      }
    } catch (error) {
      console.error('Save to device failed:', error);
      Alert.alert('Error', 'Failed to save the backup to your device.');
    }
  },

  /**
   * Import data from a JSON file selected by the user
   */
  importData: async (onSuccess?: () => void) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      const content = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const importedData = JSON.parse(content);

      // Simple validation: check if it looks like our data
      // (At least one of our known keys should be present)
      const knownKeys = ['app.memories', 'app.user_data', 'app.settings'];
      const hasKnownKeys = Object.keys(importedData).some((key) =>
        knownKeys.includes(key)
      );

      if (!hasKnownKeys) {
        Alert.alert(
          'Invalid File',
          'The selected file does not appear to be a valid MemoryGraph backup.'
        );
        return;
      }

      Alert.alert(
        'Import Data',
        'This will overwrite your current data. Are you sure you want to proceed?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'destructive',
            onPress: () => {
              try {
                // Clear existing data (optional, but cleaner)
                storage.clearAll();

                // Restore data from backup
                Object.entries(importedData).forEach(([key, value]) => {
                  if (typeof value === 'string') {
                    storage.set(key, value);
                  } else {
                    storage.set(key, JSON.stringify(value));
                  }
                });

                Alert.alert('Success', 'Data imported successfully!');
                if (onSuccess) onSuccess();
              } catch (e) {
                console.error('Restore failed:', e);
                Alert.alert('Import Failed', 'Failed to restore data from the file.');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Import failed:', error);
      Alert.alert('Import Failed', 'An error occurred while importing your data.');
    }
  },
};
