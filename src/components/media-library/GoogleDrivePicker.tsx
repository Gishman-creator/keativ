import React from 'react';
import useDrivePicker from 'react-google-drive-picker';

// Custom hook to handle Google Drive picker functionality
const useGoogleDrivePicker = (onFilesSelected: (files: File[]) => void) => {
    const [openPicker, authResponse] = useDrivePicker();
    
    const openGoogleDrivePicker = () => {
        openPicker({
            clientId: import.meta.env.VITE_CLIENT_ID,
            developerKey: import.meta.env.VITE_API_KEY,
            // Use viewMimeTypes to filter specific file types
            viewMimeTypes: [
                // Image MIME types
                'image/jpeg',
                'image/jpg', 
                'image/png',
                'image/gif',
                'image/bmp',
                'image/svg+xml',
                'image/webp',
                'image/tiff',
                // Video MIME types
                'video/mp4',
                'video/avi',
                'video/mov',
                'video/wmv',
                'video/flv',
                'video/webm',
                'video/mkv',
                'video/m4v',
                'video/3gpp',
                // Audio MIME types
                'audio/mpeg',
                'audio/mp3',
                'audio/wav',
                'audio/flac',
                'audio/aac',
                'audio/ogg',
                'audio/wma',
                'audio/m4a',
                'audio/opus'
            ].join(','),
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            callbackFunction: async (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button');
                    return;
                }
                
                if (data.action === 'picked' && data.docs && data.docs.length > 0) {
                    console.log('Selected files from Google Drive:', data.docs);
                    
                    try {
                        // Get access token from the auth response or from the library
                        const accessToken = authResponse?.access_token;
                        
                        if (!accessToken) {
                            console.error('No access token available for downloading files');
                            // Show error message to user
                            return;
                        }
                        
                        // Convert Google Drive files to File objects using Google Drive API
                        const filePromises = data.docs.map(async (doc) => {
                            try {
                                // Use Google Drive API to download the file
                                const response = await fetch(`https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`, {
                                    headers: {
                                        'Authorization': `Bearer ${accessToken}`,
                                    },
                                });
                                
                                if (!response.ok) {
                                    throw new Error(`Failed to download file: ${response.statusText}`);
                                }
                                
                                const blob = await response.blob();
                                
                                // Create a File object from the blob
                                const file = new File([blob], doc.name, {
                                    type: doc.mimeType
                                });
                                
                                return file;
                            } catch (error) {
                                console.error(`Error downloading file ${doc.name}:`, error);
                                throw error;
                            }
                        });
                        
                        // Wait for all files to be processed
                        const files = await Promise.all(filePromises);
                        
                        // Call the callback function with the converted files
                        if (onFilesSelected) {
                            onFilesSelected(files);
                        }
                        
                    } catch (error) {
                        console.error('Error processing Google Drive files:', error);
                        // You might want to show an error toast here
                    }
                }
            },
        });
    };

    return { openGoogleDrivePicker, authResponse };
};

export default useGoogleDrivePicker;