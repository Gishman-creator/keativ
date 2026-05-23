import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Settings, UserPlus, Trash2, ChevronRight, MessageSquare } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/constants';
import { api } from '@/lib/api';
import { showCustomToast, showSmallToast } from '@/components/CustomToast';

interface WorkspaceMember {
  id: number;
  user: number;
  username: string;
  email: string;
  role: string;
}

interface Workspace {
  id: number;
  name: string;
  description: string;
  created_at: string;
  member_count?: number;
}

export default function Collaborators() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) fetchMembers(selectedWorkspace.id);
  }, [selectedWorkspace]);

  const fetchWorkspaces = async () => {
    setLoading(true);
    const res = await api.get<Workspace[]>(API_ENDPOINTS.COLLABORATORS.WORKSPACES.LIST);
    if (res.success && res.data) {
      setWorkspaces(Array.isArray(res.data) ? res.data : []);
    }
    setLoading(false);
  };

  const fetchMembers = async (workspaceId: number) => {
    const res = await api.get<WorkspaceMember[]>(API_ENDPOINTS.COLLABORATORS.WORKSPACES.MEMBERS(workspaceId));
    if (res.success && res.data) {
      setMembers(Array.isArray(res.data) ? res.data : []);
    }
  };

  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    const res = await api.post<Workspace>(API_ENDPOINTS.COLLABORATORS.WORKSPACES.LIST, {
      name: newWorkspaceName,
      description: newWorkspaceDesc,
    });
    if (res.success && res.data) {
      setWorkspaces(prev => [res.data!, ...prev]);
      setShowCreateForm(false);
      setNewWorkspaceName('');
      setNewWorkspaceDesc('');
      showSmallToast('Workspace created!');
    } else {
      showCustomToast('Error', 'Failed to create workspace', 'error');
    }
  };

  const deleteWorkspace = async (id: number) => {
    const res = await api.delete(API_ENDPOINTS.COLLABORATORS.WORKSPACES.DETAIL(id));
    if (res.success) {
      setWorkspaces(prev => prev.filter(w => w.id !== id));
      if (selectedWorkspace?.id === id) setSelectedWorkspace(null);
      showSmallToast('Workspace deleted.');
    } else {
      showCustomToast('Error', 'Failed to delete workspace', 'error');
    }
  };

  const inviteMember = async () => {
    if (!selectedWorkspace || !inviteEmail.trim()) return;
    const res = await api.post(API_ENDPOINTS.COLLABORATORS.WORKSPACES.INVITE(selectedWorkspace.id), {
      email: inviteEmail,
      role: inviteRole,
    });
    if (res.success) {
      showSmallToast(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteForm(false);
      fetchMembers(selectedWorkspace.id);
    } else {
      showCustomToast('Error', 'Failed to send invite', 'error');
    }
  };

  const removeMember = async (memberId: number) => {
    if (!selectedWorkspace) return;
    const res = await api.delete(
      API_ENDPOINTS.COLLABORATORS.WORKSPACES.REMOVE_MEMBER(selectedWorkspace.id, memberId)
    );
    if (res.success) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
      showSmallToast('Member removed.');
    } else {
      showCustomToast('Error', 'Failed to remove member', 'error');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="font-heading text-3xl font-bold text-gray-900">Collaborators</h1>
          <p className="text-gray-600 mt-1">Manage workspaces, invite teammates, and review posts together</p>
        </div>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Workspace
        </Button>
      </div>

      {/* Create workspace form */}
      {showCreateForm && (
        <Card className="border border-red-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Create Workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Workspace name"
              value={newWorkspaceName}
              onChange={e => setNewWorkspaceName(e.target.value)}
            />
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              placeholder="Description (optional)"
              rows={2}
              value={newWorkspaceDesc}
              onChange={e => setNewWorkspaceDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={createWorkspace} className="bg-red-500 hover:bg-red-600 text-white text-sm">
                Create
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)} className="text-sm">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Workspaces</h2>
          {loading && <p className="text-sm text-gray-400">Loading…</p>}
          {!loading && workspaces.length === 0 && (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No workspaces yet</p>
              <Button
                size="sm"
                className="mt-3 bg-red-500 hover:bg-red-600 text-white"
                onClick={() => setShowCreateForm(true)}
              >
                Create your first workspace
              </Button>
            </div>
          )}
          {workspaces.map(ws => (
            <Card
              key={ws.id}
              className={`cursor-pointer border transition-all hover:shadow-md ${selectedWorkspace?.id === ws.id ? 'border-red-400 shadow-sm' : 'border-gray-200'}`}
              onClick={() => setSelectedWorkspace(ws)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{ws.name}</p>
                    {ws.description && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">{ws.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(ws.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <button
                      className="p-1 hover:text-red-500 text-gray-400 transition-colors"
                      onClick={e => { e.stopPropagation(); deleteWorkspace(ws.id); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workspace Details */}
        <div className="lg:col-span-2">
          {!selectedWorkspace ? (
            <div className="flex items-center justify-center h-64 border border-dashed border-gray-200 rounded-xl">
              <div className="text-center">
                <Settings className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Select a workspace to manage it</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">{selectedWorkspace.name} — Members</CardTitle>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => setShowInviteForm(!showInviteForm)}
                  >
                    <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                    Invite
                  </Button>
                </CardHeader>
                <CardContent>
                  {showInviteForm && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
                      <input
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                        placeholder="Email address"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                      />
                      <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        value={inviteRole}
                        onChange={e => setInviteRole(e.target.value)}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={inviteMember} className="bg-red-500 hover:bg-red-600 text-white text-xs">
                          Send Invite
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowInviteForm(false)} className="text-xs">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {members.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">No members yet. Invite someone!</p>
                  ) : (
                    <div className="space-y-2">
                      {members.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-red-600 font-medium text-sm">
                                {m.username?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{m.username}</p>
                              <p className="text-xs text-gray-500">{m.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">{m.role}</Badge>
                            <button
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              onClick={() => removeMember(m.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Post Review Collaboration */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-red-500" />
                    Post Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-gray-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                    <p className="text-sm">Assign posts for review from the Posts page</p>
                    <p className="text-xs mt-1">Use the ··· menu on any post to assign it to this workspace</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
