import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MessageCircle,
  Search,
  Filter,
  Reply,
  Heart,
  Share,
  MoreHorizontal,
  Instagram,
  Twitter,
  Facebook,
  Loader2,
} from 'lucide-react';
import { api, ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/constants';

interface MessageItem {
  id: string;
  user: number;
  platform: string;
  recipient: string;
  content: string;
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  message_type: 'direct' | 'automated' | 'broadcast';
  priority: 'high' | 'normal' | 'low';
  created_at: string;
  sent_at?: string | null;
}

const Messages = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    const res: ApiResponse<MessageItem[]> = await api.get(API_ENDPOINTS.MESSAGING.MESSAGES.LIST);
    if (res.success && Array.isArray(res.data)) {
      setMessages(res.data);
      setSelectedMessage(res.data[0] ?? null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'instagram':
        return 'bg-pink-100 text-pink-700';
      case 'twitter':
        return 'bg-blue-100 text-blue-700';
      case 'facebook':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) =>
      m.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="font-heading text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Manage all your social media conversations in one place</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchMessages}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Filter className="mr-2 h-4 w-4" />}
            {loading ? 'Refreshing' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <Card className="lg:col-span-1 border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Inbox</CardTitle>
              <Badge variant="secondary">{messages.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {loading ? (
                <div className="p-4 text-gray-600 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading messages...
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-4 text-gray-600">No messages</div>
              ) : (
                filteredMessages.map((message: MessageItem) => (
                  <div
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-red-50 border-l-red-500'
                        : 'border-l-transparent'
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={''} alt={message.recipient} />
                        <AvatarFallback>
                          {message.recipient?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {message.recipient}
                          </p>
                          <div className={`px-2 py-1 rounded-full text-xs ${getPlatformColor(message.platform)}`}>
                            {getPlatformIcon(message.platform)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                          {message.content}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleDateString()} at{' '}
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          {selectedMessage ? (
            <>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={''} alt={selectedMessage.recipient} />
                      <AvatarFallback>
                        {selectedMessage.recipient?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedMessage.recipient}</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs ${getPlatformColor(selectedMessage.platform)}`}>
                          {getPlatformIcon(selectedMessage.platform)}
                          <span className="ml-1">{selectedMessage.platform}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(selectedMessage.created_at).toLocaleDateString()} at{' '}
                          {new Date(selectedMessage.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">{selectedMessage.content}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Heart className="mr-2 h-4 w-4" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm">
                      <Reply className="mr-2 h-4 w-4" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Quick Reply</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="justify-start">
                          Thank you for your message!
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          I'll get back to you soon.
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          Thanks for your interest!
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          Let me check on that for you.
                        </Button>
                      </div>

                      <div className="flex space-x-2">
                        <Input placeholder="Type your reply..." className="flex-1" />
                        <Button className="bg-red-500 hover:bg-red-600">Send</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No Message Selected</h3>
                <p className="text-gray-500">Select a message from the inbox to view details</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Message Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            <p className="text-sm text-gray-600">Total Messages</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{messages.filter(m => m.status !== 'delivered' && m.status !== 'sent').length}</p>
            <p className="text-sm text-gray-600">Pending/Failed</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <Reply className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{messages.filter(m => m.status === 'sent' || m.status === 'delivered').length}</p>
            <p className="text-sm text-gray-600">Delivered</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 font-bold text-sm">—</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">—</p>
            <p className="text-sm text-gray-600">Avg Response</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
