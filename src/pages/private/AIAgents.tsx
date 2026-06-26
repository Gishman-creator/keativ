import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { api, ApiResponse } from '@/lib/api';
import { Sparkles, Plus, Trash2, Edit2, Bot, Sliders, Check, HelpCircle, ArrowLeft, Loader2 } from 'lucide-react';

export interface AIAgent {
  id: string;
  name: string;
  persona: string;
  platform: string;
  tone: string;
  temperature: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const AIAgents = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Partial<AIAgent>>({
    name: '',
    persona: '',
    platform: 'all',
    tone: 'professional',
    temperature: 0.7,
    is_active: true,
  });

  const loadAgents = async () => {
    setLoading(true);
    try {
      const response = await api.get<any>('/api/integrations/ai-agents/');
      if (response.success && response.data) {
        const agentsList = Array.isArray(response.data)
          ? response.data
          : (response.data.results || []);
        setAgents(agentsList);
      } else {
        toast.error(response.error || 'Failed to fetch AI agents');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while loading agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleEdit = (agent: AIAgent) => {
    setCurrentAgent(agent);
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setCurrentAgent({
      name: '',
      persona: '',
      platform: 'all',
      tone: 'professional',
      temperature: 0.7,
      is_active: true,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    try {
      const response = await api.delete(`/api/integrations/ai-agents/${id}/`);
      if (response.success) {
        toast.success('Agent deleted successfully');
        loadAgents();
      } else {
        toast.error(response.error || 'Failed to delete agent');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting the agent');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAgent.name?.trim() || !currentAgent.persona?.trim()) {
      toast.error('Name and Persona fields are required');
      return;
    }

    try {
      let response;
      if (currentAgent.id) {
        // Update
        response = await api.put<AIAgent>(
          `/api/integrations/ai-agents/${currentAgent.id}/`,
          currentAgent as Record<string, unknown>
        );
      } else {
        // Create
        response = await api.post<AIAgent>(
          '/api/integrations/ai-agents/',
          currentAgent as Record<string, unknown>
        );
      }

      if (response.success) {
        toast.success(currentAgent.id ? 'Agent updated successfully' : 'Agent created successfully');
        setIsEditing(false);
        loadAgents();
      } else {
        toast.error(response.error || 'Failed to save agent');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while saving the agent');
    }
  };

  const getTemperatureLabel = (temp: number) => {
    if (temp <= 0.3) return 'Consistent & Factual';
    if (temp <= 0.7) return 'Balanced';
    return 'Creative & Bold';
  };

  const TONES = [
    { value: 'professional', label: 'Professional / Corporate' },
    { value: 'witty', label: 'Witty / Sarcastic' },
    { value: 'persuasive', label: 'Persuasive / Sales' },
    { value: 'educational', label: 'Educational / Informative' },
    { value: 'humorous', label: 'Humorous / Funny' },
    { value: 'bold', label: 'Bold / Energetic' },
  ];

  const PLATFORMS = [
    { value: 'all', label: 'All Platforms' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
  ];

  if (loading && agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <p className="text-gray-500 text-sm">Loading your custom agents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-purple-600 animate-pulse" />
            AI Agent Builder
          </h1>
          <p className="text-gray-600 mt-1">
            Build and manage custom AI personas with distinct instructions, tones, and creativity to generate posts for your channels.
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleCreateNew} className="bg-red-500 hover:bg-red-600 text-white font-medium flex items-center gap-2 shadow-sm transition-all duration-200">
            <Plus className="h-4 w-4" />
            Create Agent
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="border-0 shadow-lg bg-white overflow-hidden transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-red-50 border-b p-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-8 w-8 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {currentAgent.id ? 'Edit AI Agent' : 'Create Custom AI Agent'}
                </CardTitle>
                <CardDescription>Configure parameters for your customized post generator.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Agent Name */}
                <div className="space-y-2">
                  <Label htmlFor="agent-name" className="text-sm font-semibold text-gray-700">Agent Name</Label>
                  <Input
                    id="agent-name"
                    value={currentAgent.name || ''}
                    onChange={(e) => setCurrentAgent({ ...currentAgent, name: e.target.value })}
                    placeholder="e.g. Sarcastic Tech Critic"
                    required
                    className="border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Target Platform */}
                <div className="space-y-2">
                  <Label htmlFor="agent-platform" className="text-sm font-semibold text-gray-700">Target Platform</Label>
                  <Select
                    value={currentAgent.platform || 'all'}
                    onValueChange={(v) => setCurrentAgent({ ...currentAgent, platform: v })}
                  >
                    <SelectTrigger id="agent-platform" className="border-gray-300 focus:ring-purple-500 focus:border-purple-500">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label htmlFor="agent-tone" className="text-sm font-semibold text-gray-700">Writing Tone</Label>
                  <Select
                    value={currentAgent.tone || 'professional'}
                    onValueChange={(v) => setCurrentAgent({ ...currentAgent, tone: v })}
                  >
                    <SelectTrigger id="agent-tone" className="border-gray-300 focus:ring-purple-500 focus:border-purple-500">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="agent-temp" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <Sliders className="h-4 w-4 text-purple-600" />
                      Creativity (Temperature)
                    </Label>
                    <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      {currentAgent.temperature?.toFixed(1) || '0.7'} ({getTemperatureLabel(currentAgent.temperature || 0.7)})
                    </span>
                  </div>
                  <input
                    id="agent-temp"
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={currentAgent.temperature ?? 0.7}
                    onChange={(e) => setCurrentAgent({ ...currentAgent, temperature: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium px-1">
                    <span>Deterministic (0.0)</span>
                    <span>Balanced (0.5)</span>
                    <span>Highly Creative (1.0)</span>
                  </div>
                </div>
              </div>

              {/* Persona Instructions */}
              <div className="space-y-2">
                <Label htmlFor="agent-persona" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Bot className="h-4 w-4 text-purple-600" />
                  System Persona & Instructions
                </Label>
                <Textarea
                  id="agent-persona"
                  value={currentAgent.persona || ''}
                  onChange={(e) => setCurrentAgent({ ...currentAgent, persona: e.target.value })}
                  placeholder="Provide precise details of the agent's background, writing constraints, emojis usage, formatting habits, etc.
e.g. 'Act as an expert developer relations marketer. Explain complex web architectures in short, punchy paragraphs. Use maximum 2 relevant emojis, and end every post with a thought-provoking engineering question.'"
                  rows={6}
                  required
                  className="border-gray-300 focus:ring-purple-500 focus:border-purple-500 font-sans leading-relaxed"
                />
              </div>

              {/* Status Switch */}
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border">
                <Switch
                  id="agent-active"
                  checked={currentAgent.is_active ?? true}
                  onCheckedChange={(checked) => setCurrentAgent({ ...currentAgent, is_active: checked })}
                />
                <div>
                  <Label htmlFor="agent-active" className="text-sm font-bold text-gray-700">Active Status</Label>
                  <p className="text-xs text-gray-500">Enable or disable this agent's availability in content enhancer tools.</p>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-md">
                  <Check className="h-4 w-4 mr-2" />
                  Save Agent Configuration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.length === 0 ? (
            <Card className="col-span-full border-dashed border-2 p-12 text-center flex flex-col items-center justify-center space-y-4">
              <Bot className="h-16 w-16 text-gray-300 stroke-[1.5]" />
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-800">No Custom Agents Yet</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mt-1">
                  Create custom agent configurations to craft unique brand voices and write high-performing social posts automatically.
                </p>
              </div>
              <Button onClick={handleCreateNew} className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Build Your First Agent
              </Button>
            </Card>
          ) : (
            agents.map((agent) => (
              <Card key={agent.id} className="relative hover:shadow-lg transition-all duration-300 group flex flex-col justify-between overflow-hidden border border-gray-100 bg-white">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-red-500"></div>
                <div>
                  <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1 flex items-center gap-1.5">
                        <Bot className="h-5 w-5 text-purple-600 shrink-0" />
                        {agent.name}
                      </CardTitle>
                      <CardDescription className="text-xs capitalize font-medium text-gray-500 flex items-center gap-1 mt-1">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{agent.platform}</span>
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">{agent.tone}</span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(agent)} className="h-8 w-8 p-0 text-gray-500 hover:text-purple-600 hover:bg-purple-50">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(agent.id)} className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed font-sans bg-gray-50 p-3 rounded-lg border-l-4 border-purple-400">
                      {agent.persona}
                    </p>
                  </CardContent>
                </div>
                <div className="px-6 py-4 border-t bg-gray-50/50 flex justify-between items-center text-xs font-semibold text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-purple-500" />
                    <span>Temp: {agent.temperature.toFixed(1)}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    agent.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {agent.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AIAgents;
