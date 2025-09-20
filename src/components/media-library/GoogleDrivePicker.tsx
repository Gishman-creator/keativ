import React from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { showCustomToast } from '../CustomToast';

// Custom hook to handle Google Drive picker functionality
const useGoogleDrivePicker = (onFilesSelected: (files: File[]) => void, setIsUploading: (isUploading: boolean) => void) => {
    const [openPicker, authResponse] = useDrivePicker();
    
    const openGoogleDrivePicker = () => {
        openPicker({
            clientId: import.meta.env.VITE_CLIENT_ID,
            developerKey: import.meta.env.VITE_API_KEY,
            // Add token property to use existing auth
            token: authResponse?.access_token,
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
                    setIsUploading(true); // Set isUploading to true when files are picked
                    
                    try {
                        // Get access token - try multiple sources
                        let accessToken = authResponse?.access_token;
                        
                        // If no token from authResponse, try to get it from Google Auth
                        if (!accessToken && window.gapi?.auth2) {
                            const authInstance = window.gapi.auth2.getAuthInstance();
                            if (authInstance) {
                                const user = authInstance.currentUser.get();
                                if (user && user.isSignedIn()) {
                                    const authResp = user.getAuthResponse(true);
                                    accessToken = authResp.access_token;
                                }
                            }
                        }
                        
                        if (!accessToken) {
                            console.error('No access token available for downloading files');
                            showCustomToast('Failed to authenticate', 'Unable to authenticate with Google Drive. Please try again.', 'error');
                            setIsUploading(false);
                            throw new Error('Authentication failed. Please try again.');
                        }
                        
                        console.log('Using access token for downloads...');
                        
                        // Convert Google Drive files to File objects using Google Drive API
                        const filePromises = data.docs.map(async (doc) => {
                            try {
                                console.log(`Downloading file: ${doc.name} (${doc.id})`);
                                
                                // Use Google Drive API to download the file
                                const response = await fetch(`https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`, {
                                    headers: {
                                        'Authorization': `Bearer ${accessToken}`,
                                    },
                                });
                                
                                if (!response.ok) {
                                    console.error(`HTTP ${response.status}: ${response.statusText} for file ${doc.name}`);
                                    
                                    if (response.status === 401) {
                                        throw new Error('Access token expired. Please refresh and try again.');
                                    } else if (response.status === 403) {
                                        throw new Error('Permission denied. Check API quotas and permissions.');
                                    }
                                    
                                    throw new Error(`Failed to download file: ${response.statusText}`);
                                }
                                
                                const blob = await response.blob();
                                console.log(`Successfully downloaded: ${doc.name} (${blob.size} bytes)`);
                                
                                // Create a File object from the blob
                                const file = new File([blob], doc.name, {
                                    type: doc.mimeType || blob.type
                                });
                                
                                return file;
                            } catch (error) {
                                console.error(`Error downloading file ${doc.name}:`, error);
                                throw error;
                            }
                        });
                        
                        // Wait for all files to be processed
                        const files = await Promise.all(filePromises);
                        console.log(`Successfully processed ${files.length} files`);
                        
                        // Call the callback function with the converted files
                        if (onFilesSelected) {
                            onFilesSelected(files);
                        }
                        
                        setIsUploading(false); // Set isUploading to false when processing is complete
                        
                    } catch (error:any) {
                        console.error('Error processing Google Drive files:', error);
                        setIsUploading(false); // Set isUploading to false on error
                        showCustomToast('Upload failed', error.message || 'Failed to process files from Google Drive', 'error');
                    }
                }
            },
        });
    };

    return { openGoogleDrivePicker, authResponse };
};

export default useGoogleDrivePicker;