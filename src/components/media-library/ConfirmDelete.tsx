import React, { useEffect, useRef } from 'react';
import { Button } from '../ui/button';

interface ConfirmDeleteProps {
    onConfirm: () => void;
    onCancel: () => void;
    message?: string;
}

function ConfirmDelete({ onConfirm, onCancel, message }: ConfirmDeleteProps) {

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Function to handle clicks outside the component
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                onCancel();
            }
        }

        // Add event listener when the component mounts
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onCancel]);

    return (
        <div
            ref={wrapperRef}
            className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg p-4 z-50 animate-in fade-in-0 slide-in-from-top-1"
        >
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold">
                    Confirm Deletion
                </h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
                {message || "Are you sure you want to delete this file(s)? This action cannot be undone and will permanently delete the file(s)."}
            </p>

            <div className="flex gap-2 justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    className='border-none focus:ring-0 focus:ring-offset-0 shadow-none'
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={onConfirm}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}

export default ConfirmDelete;