import { useState } from 'react';
import { X, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/constants';
import { showCustomToast, showSmallToast } from '@/components/CustomToast';

interface MediaTagEditorProps {
  fileId: string;
  initialTags?: string[];
  onClose: () => void;
  onSave?: (tags: string[]) => void;
}

export default function MediaTagEditor({ fileId, initialTags = [], onClose, onSave }: MediaTagEditorProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    const trimmed = input.trim().toLowerCase().replace(/\s+/g, '-');
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const save = async () => {
    setSaving(true);
    const res = await api.put(API_ENDPOINTS.MEDIA.TAGS(fileId), { tags });
    if (res.success) {
      showSmallToast('Tags saved!');
      onSave?.(tags);
      onClose();
    } else {
      showCustomToast('Error', 'Failed to save tags', 'error');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-red-500" />
            Edit Tags
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current tags */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
          {tags.length === 0 && (
            <span className="text-xs text-gray-400 italic">No tags yet</span>
          )}
          {tags.map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs"
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-5">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            placeholder="Type tag, press Enter"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={addTag}
            className="px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={save}
            disabled={saving}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm"
          >
            {saving ? 'Saving…' : 'Save Tags'}
          </Button>
          <Button variant="outline" onClick={onClose} className="text-sm">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
