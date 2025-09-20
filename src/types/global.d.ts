declare global {
    interface Window {
        gapi?: {
            auth2?: {
                getAuthInstance: () => any;
                init: (config: any) => Promise<any>;
            };
            load: (api: string, callback: () => void) => void;
        };
    }
}

export {};