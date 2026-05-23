import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout, Filter, Download, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface BrandPost {
  id: string;
  content: string;
  caption?: string;
  platform: string;
  post_type?: string;
  image?: string;
  status: string;
  created_at: string;
}

const PLATFORM_GRADIENT: Record<string, string> = {
  instagram: 'from-pink-500 to-orange-400',
  twitter: 'from-sky-400 to-blue-500',
  facebook: 'from-blue-600 to-blue-800',
  linkedin: 'from-blue-700 to-blue-900',
  tiktok: 'from-gray-800 to-gray-950',
};

const PLATFORM_COLOR: Record<string, string> = {
  instagram: 'bg-pink-100 text-pink-700 border-pink-200',
  twitter: 'bg-sky-100 text-sky-700 border-sky-200',
  facebook: 'bg-blue-100 text-blue-700 border-blue-200',
  linkedin: 'bg-slate-100 text-slate-700 border-slate-200',
  tiktok: 'bg-gray-100 text-gray-700 border-gray-300',
};

export default function BrandWall() {
  const [posts, setPosts] = useState<BrandPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get<{ results?: BrandPost[]; data?: BrandPost[] } | BrandPost[]>(
        `${API_BASE}/api/posts/brand-wall/`
      );
      if (res.success && res.data) {
        const data = res.data as unknown;
        if (Array.isArray(data)) {
          setPosts(data as BrandPost[]);
        } else if (data && typeof data === 'object') {
          const obj = data as Record<string, unknown>;
          const arr = (obj.results || obj.data || []) as BrandPost[];
          setPosts(Array.isArray(arr) ? arr : []);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const platforms = ['all', ...Array.from(new Set(posts.map(p => p.platform).filter(Boolean)))];

  const filtered = platformFilter === 'all'
    ? posts
    : posts.filter(p => p.platform === platformFilter);

  const published = filtered.filter(p => p.status === 'published');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="font-heading text-3xl font-bold text-gray-900">Brand Wall</h1>
          <p className="text-gray-600 mt-1">Your published content gallery across all platforms</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['instagram', 'twitter', 'facebook', 'linkedin'] as const).map(p => {
          const count = posts.filter(post => post.platform === p && post.status === 'published').length;
          return (
            <Card key={p} className="border-0 shadow-sm overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${PLATFORM_GRADIENT[p] || 'from-gray-300 to-gray-500'}`} />
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-xs capitalize text-gray-500 mt-0.5">{p} posts</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Platform Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        {platforms.map(p => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={`px-3 py-1 rounded-full text-sm border transition-all capitalize ${
              platformFilter === p
                ? 'bg-red-500 text-white border-red-500'
                : 'border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-sm text-gray-400">Loading brand wall…</div>
      ) : published.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-xl">
          <Layout className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No published posts yet</p>
          <p className="text-xs text-gray-400 mt-1">
            {platformFilter !== 'all' ? `No ${platformFilter} posts found` : 'Start publishing to build your brand wall'}
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {published.map(post => (
            <div
              key={post.id}
              className="break-inside-avoid border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {post.image ? (
                <div className="relative">
                  <img
                    src={post.image}
                    alt=""
                    className="w-full object-cover transition-transform group-hover:scale-105"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                </div>
              ) : (
                <div className={`h-24 bg-gradient-to-br ${PLATFORM_GRADIENT[post.platform] || 'from-gray-200 to-gray-400'} flex items-center justify-center`}>
                  <span className="text-white/70 text-4xl font-bold uppercase">
                    {post.platform?.charAt(0) || '#'}
                  </span>
                </div>
              )}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`text-xs capitalize border ${PLATFORM_COLOR[post.platform] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {post.platform}
                  </Badge>
                  {post.post_type && (
                    <span className="text-xs text-gray-400 capitalize">{post.post_type}</span>
                  )}
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {post.caption || post.content}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
