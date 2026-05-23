import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Edit2, Trash2, Copy, LayoutTemplate, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { showCustomToast, showSmallToast } from '@/components/CustomToast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface PostTemplate {
  id: string;
  name: string;
  content: string;
  hashtags?: string;
  platform?: string;
  post_type?: string;
  created_at: string;
  updated_at?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-pink-100 text-pink-700',
  twitter: 'bg-sky-100 text-sky-700',
  facebook: 'bg-blue-100 text-blue-700',
  linkedin: 'bg-blue-900 text-white',
  tiktok: 'bg-gray-900 text-white',
  default: 'bg-gray-100 text-gray-700',
};

export default function PostTemplates() {
  const [templates, setTemplates] = useState<PostTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PostTemplate | null>(null);

  const [form, setForm] = useState({
    name: '',
    content: '',
    hashtags: '',
    platform: '',
    post_type: 'post',
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    const res = await api.get<PostTemplate[]>(`${API_BASE}/api/posts/templates/`);
    if (res.success && Array.isArray(res.data)) {
      setTemplates(res.data);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', content: '', hashtags: '', platform: '', post_type: 'post' });
    setShowForm(true);
  };

  const openEdit = (t: PostTemplate) => {
    setEditing(t);
    setForm({
      name: t.name,
      content: t.content,
      hashtags: t.hashtags || '',
      platform: t.platform || '',
      post_type: t.post_type || 'post',
    });
    setShowForm(true);
  };

  const saveTemplate = async () => {
    if (!form.name.trim() || !form.content.trim()) {
      showCustomToast('Validation', 'Name and content are required', 'warning');
      return;
    }
    const url = editing
      ? `${API_BASE}/api/posts/templates/${editing.id}/`
      : `${API_BASE}/api/posts/templates/`;

    const res = editing
      ? await api.put<PostTemplate>(url, form)
      : await api.post<PostTemplate>(url, form);

    if (res.success && res.data) {
      if (editing) {
        setTemplates(prev => prev.map(t => t.id === editing.id ? res.data! : t));
        showSmallToast('Template updated.');
      } else {
        setTemplates(prev => [res.data!, ...prev]);
        showSmallToast('Template created!');
      }
      setShowForm(false);
      setEditing(null);
    } else {
      showCustomToast('Error', 'Failed to save template', 'error');
    }
  };

  const deleteTemplate = async (id: string) => {
    const res = await api.delete(`${API_BASE}/api/posts/templates/${id}/`);
    if (res.success) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      showSmallToast('Template deleted.');
    } else {
      showCustomToast('Error', 'Failed to delete template', 'error');
    }
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content).then(() => showSmallToast('Content copied!'));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="font-heading text-3xl font-bold text-gray-900">Post Templates</h1>
          <p className="text-gray-600 mt-1">Save and reuse your best content formats</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <Card className="border border-red-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{editing ? 'Edit Template' : 'Create Template'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Template name *"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              placeholder="Post content *"
              rows={5}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            />
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Hashtags (e.g. #marketing #content)"
              value={form.hashtags}
              onChange={e => setForm(f => ({ ...f, hashtags: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.platform}
                onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
              >
                <option value="">All platforms</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter/X</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
              </select>
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.post_type}
                onChange={e => setForm(f => ({ ...f, post_type: e.target.value }))}
              >
                <option value="post">Post</option>
                <option value="story">Story</option>
                <option value="reel">Reel</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveTemplate} className="bg-red-500 hover:bg-red-600 text-white text-sm">
                {editing ? 'Update' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="text-sm">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Grid */}
      {loading ? (
        <div className="text-sm text-gray-400">Loading templates…</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
          <LayoutTemplate className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No templates yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first template to start reusing content</p>
          <Button size="sm" className="mt-4 bg-red-500 hover:bg-red-600 text-white" onClick={openCreate}>
            Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(t => (
            <Card key={t.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2 flex-wrap">
                    {t.platform && (
                      <Badge className={`text-xs ${PLATFORM_COLORS[t.platform] || PLATFORM_COLORS.default}`}>
                        {t.platform}
                      </Badge>
                    )}
                    {t.post_type && (
                      <Badge variant="outline" className="text-xs capitalize">{t.post_type}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      onClick={() => copyContent(t.content)}
                      title="Copy content"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                      onClick={() => openEdit(t)}
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      onClick={() => deleteTemplate(t.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />
                  {t.name}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3 flex-1">{t.content}</p>

                {t.hashtags && (
                  <p className="text-xs text-blue-500 mt-2 line-clamp-1">{t.hashtags}</p>
                )}

                <div className="flex items-center gap-1 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
