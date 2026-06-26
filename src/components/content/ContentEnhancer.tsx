/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Zap, Copy, Check, Brain, Sparkles, ChevronDown, ChevronUp, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/constants';
import { api } from '@/lib/api';

interface ContentEnhancerProps {
  originalContent: string;
  platform: string;
  onContentSelect?: (content: string) => void;
}

interface AIAgent {
  id: string;
  name: string;
  platform: string;
  tone: string;
  is_active: boolean;
}

const ContentEnhancer: React.FC<ContentEnhancerProps> = ({
  originalContent,
  platform,
  onContentSelect
}) => {
  interface ContentSuggestion {
    content: string;
    confidence?: number;
    agent_name?: string;
    generation_method?: string;
    plan_topic?: string;
    reason?: string;
    plan?: {
      topic: string;
      hook: string;
      key_message: string;
      cta: string;
      hashtag_strategy: string[];
      format_notes: string;
    };
  }

  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('default');
  const [thinkingStep, setThinkingStep] = useState<number>(0);
  const [expandedPlans, setExpandedPlans] = useState<Record<number, boolean>>({});

  const togglePlanExpand = (index: number) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Simulated thinking step logic removed - relying on real-time Server-Sent Events (SSE) updates

  // Load custom agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get<any>('/api/integrations/ai-agents/');
        if (response.success && response.data) {
          const agentsList = Array.isArray(response.data)
            ? response.data
            : (response.data.results || []);
          // Filter to active agents matching platform or "all"
          const filtered = agentsList.filter(
            (agent: any) => agent.is_active && (agent.platform === platform || agent.platform === 'all')
          );
          setAgents(filtered);
        }
      } catch (err) {
        console.error('Failed to load agents:', err);
      }
    };
    fetchAgents();
  }, [platform]);

  const generateSuggestions = async () => {
    if (!originalContent.trim() || originalContent.length < 5) {
      toast({
        title: 'Content too short',
        description: 'Write some content first to get suggestions',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setExpandedPlans({});
    setSuggestions([]);
    setThinkingStep(1); // Set initial step to planning

    try {
      const payload: Record<string, any> = {
        content: originalContent,
        platform,
      };

      if (selectedAgentId && selectedAgentId !== 'default') {
        payload.agent_id = selectedAgentId;
      }

      const token = api.getToken();
      // Use native fetch to consume the Server-Sent Events stream
      const response = await fetch(`${api.baseURL}/api/posts/ai/content-suggestions/stream/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          ...(token ? { 'Authorization': `Token ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      if (!reader) throw new Error('No response body reader');

      let buffer = '';
      const mapToSuggestion = (item: any): ContentSuggestion => {
        if (typeof item === 'object' && item !== null) {
          return {
            content: item.content || '',
            confidence: item.confidence,
            agent_name: item.agent_name,
            generation_method: item.generation_method,
            plan_topic: item.plan_topic,
            reason: item.reason,
            plan: item.plan,
          };
        }
        return { content: String(item) };
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            try {
              const eventData = JSON.parse(dataStr);
              if (eventData.step === 'planning') {
                setThinkingStep(1);
              } else if (eventData.step === 'writing') {
                setThinkingStep(2);
              } else if (eventData.step === 'reviewing') {
                setThinkingStep(3);
              } else if (eventData.step === 'done') {
                const { suggestions = [] } = eventData;
                const combined = suggestions.map(mapToSuggestion);
                setSuggestions(combined.slice(0, 4));
                setThinkingStep(0);
              } else if (eventData.step === 'error') {
                throw new Error(eventData.message);
              }
            } catch (e) {
              console.error('Error parsing stream event data:', e);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error generating suggestions:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate content suggestions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setThinkingStep(0);
    }
  };

  const sendFeedback = async (suggestion: ContentSuggestion, action: 'copied' | 'used') => {
    try {
      await api.post('/api/posts/ai/feedback/', {
        content: suggestion.content,
        generation_method: suggestion.generation_method || 'reactive',
        action,
        agent_id: selectedAgentId !== 'default' ? selectedAgentId : undefined,
        platform,
      });
    } catch (err) {
      console.error('Failed to log suggestion feedback:', err);
    }
  };

  const copyToClipboard = async (suggestion: ContentSuggestion, index: number) => {
    try {
      await navigator.clipboard.writeText(suggestion.content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: 'Copied',
        description: 'Content copied to clipboard',
      });
      sendFeedback(suggestion, 'copied');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy content',
        variant: 'destructive',
      });
    }
  };

  const selectContent = (suggestion: ContentSuggestion) => {
    if (onContentSelect) {
      onContentSelect(suggestion.content);
      toast({
        title: 'Content Updated',
        description: 'Your post content has been updated with the suggestion',
      });
      sendFeedback(suggestion, 'used');
    }
  };

  if (!originalContent || originalContent.length < 5) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 text-center text-gray-500">
          <Zap className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">Write some content first to get AI-powered suggestions</p>
          <p className="text-xs text-gray-400 mt-1">Minimum 5 characters needed</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Content Suggestions
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger className="w-[160px] h-8 text-xs border-gray-200">
                <SelectValue placeholder="Select Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Copywriter</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={generateSuggestions}
              disabled={loading}
              className="h-8 text-xs"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && selectedAgentId !== 'default' && (
          <div className="space-y-4 py-4 px-3 rounded-lg border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 animate-ping" />
                <div className="relative p-2 bg-indigo-600 text-white rounded-full">
                  <Brain className="h-5 w-5 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-indigo-900">
                  Deliberative AI Pipeline Active
                </h4>
                <p className="text-[11px] text-indigo-600/80">
                  Custom agent "{agents.find(a => a.id === selectedAgentId)?.name}" is planning & executing.
                </p>
              </div>
            </div>

            <div className="space-y-3 pl-3 border-l-2 border-indigo-150 ml-4.5 mt-2">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-1 ${
                  thinkingStep >= 1 
                    ? thinkingStep === 1 
                      ? 'bg-amber-100 text-amber-700 animate-pulse' 
                      : 'bg-green-100 text-green-700' 
                    : 'bg-gray-155 text-gray-400'
                }`}>
                  {thinkingStep > 1 ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold ${thinkingStep >= 1 ? 'text-indigo-900' : 'text-gray-400'}`}>
                    Step 1: Content Planning
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {thinkingStep === 1 ? 'Mapping key messaging, hook angles, and CTAs...' : thinkingStep > 1 ? 'Outline and hooks strategy defined.' : 'Waiting to start...'}
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-1 ${
                  thinkingStep >= 2 
                    ? thinkingStep === 2 
                      ? 'bg-amber-100 text-amber-700 animate-pulse' 
                      : 'bg-green-100 text-green-700' 
                    : 'bg-gray-155 text-gray-400'
                }`}>
                  {thinkingStep > 2 ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold ${thinkingStep >= 2 ? 'text-indigo-900' : 'text-gray-400'}`}>
                    Step 2: Post Drafting & Formatting
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {thinkingStep === 2 ? 'Writing high-quality drafts grounded in the plan...' : thinkingStep > 2 ? 'Drafts composed successfully.' : 'Waiting to start...'}
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-1 ${
                  thinkingStep >= 3 
                    ? thinkingStep === 3 
                      ? 'bg-amber-100 text-amber-700 animate-pulse' 
                      : 'bg-green-100 text-green-700' 
                    : 'bg-gray-155 text-gray-400'
                }`}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-semibold ${thinkingStep >= 3 ? 'text-indigo-900' : 'text-gray-400'}`}>
                    Step 3: Quality Critique & Polish
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {thinkingStep === 3 ? 'Critiquing structure, hooks, CTA, and styling rules...' : 'Waiting to start...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && selectedAgentId === 'default' && (
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500 mb-2" />
            <span className="text-sm text-gray-600 font-medium">Generating content suggestions...</span>
            <span className="text-xs text-gray-400 mt-1">Calling AI copywriting assistant</span>
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-600 mb-3">
              AI-generated suggestions for {platform}:
            </p>
            {suggestions.map((suggestion, index) => {
              const isDeliberative = suggestion.generation_method?.startsWith('deliberative');
              const hasPlan = !!suggestion.plan;

              return (
                <Card 
                  key={index} 
                  className={`border transition-all duration-200 ${
                    isDeliberative 
                      ? 'border-indigo-150 shadow-sm hover:shadow bg-gradient-to-br from-white via-white to-indigo-50/10 hover:border-indigo-300' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant={isDeliberative ? 'default' : 'secondary'} className={`text-xs flex items-center gap-1 ${
                          isDeliberative ? 'bg-indigo-600 text-white hover:bg-indigo-600' : ''
                        }`}>
                          {isDeliberative ? <Sparkles className="h-3 w-3" /> : null}
                          Suggestion {index + 1}
                        </Badge>
                        
                        {suggestion.agent_name && (
                          <Badge variant="outline" className="text-[10px] border-indigo-200 text-indigo-700 bg-indigo-50/50">
                            🤖 Agent: {suggestion.agent_name}
                          </Badge>
                        )}

                        {suggestion.confidence && (
                          <Badge variant="outline" className="text-[10px] border-emerald-250 text-emerald-700 bg-emerald-50/50">
                            🎯 Match: {Math.round(suggestion.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(suggestion, index)}
                        >
                          {copiedIndex === index ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        {onContentSelect && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={() => selectContent(suggestion)}
                          >
                            Use
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap text-gray-800">
                      {suggestion.content}
                    </p>

                    {hasPlan && (
                      <div className="mt-3 pt-3 border-t border-indigo-100/60">
                        <button
                          onClick={() => togglePlanExpand(index)}
                          className="flex items-center text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors gap-1"
                        >
                          {expandedPlans[index] ? (
                            <>
                              <ChevronUp className="h-3.5 w-3.5" />
                              Hide Generation Plan
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3.5 w-3.5" />
                              View Generation Plan ({suggestion.plan?.topic})
                            </>
                          )}
                        </button>

                        {expandedPlans[index] && suggestion.plan && (
                          <div className="mt-2 p-2.5 rounded bg-indigo-50/40 border border-indigo-100/50 space-y-2 text-xs text-gray-700">
                            <div>
                              <span className="font-semibold text-indigo-900 block mb-0.5">Planned Hook strategy:</span>
                              <p className="italic text-gray-600">"{suggestion.plan.hook}"</p>
                            </div>
                            <div>
                              <span className="font-semibold text-indigo-900 block mb-0.5">Planned Key Message:</span>
                              <p className="text-gray-600">{suggestion.plan.key_message}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-indigo-900 block mb-0.5">Planned CTA:</span>
                              <p className="text-gray-600">{suggestion.plan.cta}</p>
                            </div>
                            {suggestion.plan.hashtag_strategy && suggestion.plan.hashtag_strategy.length > 0 && (
                              <div>
                                <span className="font-semibold text-indigo-900 block mb-0.5">Hashtag strategy:</span>
                                <div className="flex gap-1.5 mt-0.5 flex-wrap">
                                  {suggestion.plan.hashtag_strategy.map((tag, tagIdx) => (
                                    <span key={tagIdx} className="px-1.5 py-0.5 bg-indigo-100/60 text-indigo-800 rounded-sm text-[10px]">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {suggestion.plan.format_notes && (
                              <div>
                                <span className="font-semibold text-indigo-900 block mb-0.5">Platform styling advice:</span>
                                <p className="text-gray-500 text-[11px]">{suggestion.plan.format_notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No suggestions generated yet</p>
            <p className="text-xs text-gray-400 mt-1">Click Generate to get AI-powered content ideas</p>
          </div>
        )}

        {/* Help text */}
        <div className="text-xs text-gray-400 pt-2 border-t">
          💡 Click "Use" to replace your content, or "Copy" to save suggestions for later
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentEnhancer;
