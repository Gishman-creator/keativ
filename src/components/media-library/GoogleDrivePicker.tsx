import React from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { showCustomToast } from '../CustomToast';

// Custom hook to handle Google Drive picker functionality
const useGoogleDrivePicker = (onFilesSelected: (files: File[]) => void, setIsUploading: (isUploading: boolean) => void) => {
    const [openPicker, authResponse] = useDrivePicker();
    
    // Store the current access token
    let currentAccessToken: string | null = null;
    
    // Initialize Google Identity Services and get a valid token
    const initializeAndGetToken = async (): Promise<string | null> => {
        return new Promise((resolve) => {
            const initGIS = () => {
                // Initialize Google Identity Services
                if (window.google?.accounts?.oauth2) {
                    try {
                        const client = window.google.accounts.oauth2.initTokenClient({
                            client_id: import.meta.env.VITE_CLIENT_ID,
                            scope: 'https://www.googleapis.com/auth/drive.readonly',
                            callback: (response: any) => {
                                if (response.access_token) {
                                    console.log('Got token from Google Identity Services');
                                    currentAccessToken = response.access_token; // Store the token
                                    resolve(response.access_token);
                                } else {
                                    console.error('No access token in response');
                                    resolve(null);
                                }
                            },
                        });
                        
                        // Request access token
                        client.requestAccessToken({
                            prompt: 'select_account'
                        });
                        
                    } catch (error) {
                        console.error('Error initializing Google Identity Services:', error);
                        resolve(null);
                    }
                } else {
                    console.error('Google Identity Services not loaded');
                    resolve(null);
                }
            };
            
            // Load Google Identity Services library if not already loaded
            if (!window.google?.accounts?.oauth2) {
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.onload = () => {
                    // Wait a bit for the library to initialize
                    setTimeout(initGIS, 100);
                };
                script.onerror = () => {
                    console.error('Failed to load Google Identity Services script');
                    resolve(null);
                };
                document.head.appendChild(script);
            } else {
                initGIS();
            }
        });
    };

    // Helper function to ensure we have a valid access token
    const ensureValidAccessToken = async (): Promise<string | null> => {
        try {
            // First priority: check if we have a stored token from recent auth
            if (currentAccessToken) {
                console.log('Using stored access token');
                return currentAccessToken;
            }
            
            // Second priority: check if we have a token from the authResponse
            if (authResponse?.access_token) {
                console.log('Using token from authResponse');
                currentAccessToken = authResponse.access_token; // Store it for reuse
                return authResponse.access_token;
            }
            
            // Last resort: initialize Google Identity Services for new auth
            console.log('No token available, requesting new authentication...');
            const token = await initializeAndGetToken();
            return token;
            
        } catch (error) {
            console.error('Error ensuring valid access token:', error);
            return null;
        }
    };
    
    const openGoogleDrivePicker = async () => {
        // Ensure we have a valid access token before opening the picker
        try {
            const accessToken = await ensureValidAccessToken();
            if (!accessToken) {
                showCustomToast('Authentication required', 'Please complete Google Drive authentication to continue', 'error');
                return;
            }
            
            openPicker({
                clientId: import.meta.env.VITE_CLIENT_ID,
                developerKey: import.meta.env.VITE_API_KEY,
                token: accessToken, // Pass the valid token to the picker
                // Use viewMimeTypes to filter specific file types
                viewMimeTypes: [
                    // Image MIME types
                    'image/jpeg',
                    'image/jpg', 
                    'image/png',
                    'image/gif',
                    'image/webp',
                    // Video MIME types
                    'video/mp4',
                    'video/mov',
                    'video/webm',
                    'video/mkv',
                    'video/3gpp',
                    // Audio MIME types
                    'audio/mpeg',
                    'audio/mp3',
                    'audio/wav',
                    'audio/aac',
                    'audio/ogg',
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
                            // Get a fresh access token for file downloads
                            const downloadToken = await ensureValidAccessToken();
                            
                            if (!downloadToken) {
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
                                            'Authorization': `Bearer ${downloadToken}`,
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
        } catch (error:any) {
            console.error('Error opening Google Drive picker:', error);
            showCustomToast('Error', 'Failed to open Google Drive picker', 'error');
        }
    };

    return { openGoogleDrivePicker, authResponse };
};

// Add type declarations for global objects
declare global {
    interface Window {
        google?: {
            accounts?: {
                oauth2?: {
                    initTokenClient: (config: {
                        client_id: string;
                        scope: string;
                        callback: (response: any) => void;
                    }) => {
                        requestAccessToken: (options?: { prompt?: string }) => void;
                    };
                };
            };
        };
        gapi?: {
            auth2?: {
                getAuthInstance: () => any;
                init: (config: any) => Promise<any>;
            };
            load: (api: string, callback: () => void) => void;
        };
    }
}

export default useGoogleDrivePicker;