import { useState, useEffect } from 'react';
import { Folder, FolderPlus, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/constants';
import { showCustomToast, showSmallToast } from '@/components/CustomToast';

interface MediaFolder {
  id: string;
  name: string;
  file_count?: number;
}

interface FolderPanelProps {
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
}

export default function FolderPanel({ selectedFolderId, onSelectFolder }: FolderPanelProps) {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setLoading(true);
    const res = await api.get<MediaFolder[]>(API_ENDPOINTS.MEDIA.FOLDERS);
    if (res.success && Array.isArray(res.data)) {
      setFolders(res.data);
    }
    setLoading(false);
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const res = await api.post<MediaFolder>(API_ENDPOINTS.MEDIA.FOLDERS, { name: newFolderName });
    if (res.success && res.data) {
      setFolders(prev => [...prev, res.data!]);
      setNewFolderName('');
      setShowCreate(false);
      showSmallToast('Folder created!');
    } else {
      showCustomToast('Error', 'Failed to create folder', 'error');
    }
  };

  const deleteFolder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await api.delete(API_ENDPOINTS.MEDIA.FOLDER_DETAIL(id));
    if (res.success) {
      setFolders(prev => prev.filter(f => f.id !== id));
      if (selectedFolderId === id) onSelectFolder(null);
      showSmallToast('Folder deleted.');
    } else {
      showCustomToast('Error', 'Failed to delete folder', 'error');
    }
  };

  return (
    <div className="w-52 flex-shrink-0 border-r border-gray-200 pr-4 space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Folders</span>
        <button
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          onClick={() => setShowCreate(!showCreate)}
          title="New folder"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      {showCreate && (
        <div className="space-y-1.5 mb-2">
          <input
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-300"
            placeholder="Folder name"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createFolder()}
            autoFocus
          />
          <div className="flex gap-1">
            <Button size="sm" onClick={createFolder} className="h-6 text-xs px-2 bg-red-500 hover:bg-red-600 text-white">
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowCreate(false)} className="h-6 text-xs px-2">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* All Files */}
      <button
        className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
          selectedFolderId === null ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
        }`}
        onClick={() => onSelectFolder(null)}
      >
        <Folder className="w-4 h-4 flex-shrink-0" />
        <span>All Files</span>
      </button>

      {loading && <p className="text-xs text-gray-400 px-2">Loading…</p>}

      {folders.map(folder => (
        <button
          key={folder.id}
          className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm group transition-colors ${
            selectedFolderId === folder.id ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => onSelectFolder(folder.id)}
        >
          {selectedFolderId === folder.id
            ? <FolderOpen className="w-4 h-4 flex-shrink-0" />
            : <Folder className="w-4 h-4 flex-shrink-0" />}
          <span className="flex-1 truncate">{folder.name}</span>
          {folder.file_count != null && (
            <span className="text-xs text-gray-400">{folder.file_count}</span>
          )}
          <button
            className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 transition-all ml-1"
            onClick={e => deleteFolder(folder.id, e)}
            title="Delete folder"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </button>
      ))}
    </div>
  );
}
