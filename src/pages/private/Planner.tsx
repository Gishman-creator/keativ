import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus, Filter } from 'lucide-react';
import { postsApi } from '@/lib/api';
import { CreatePostDialog } from '@/components/CreatePostDialog';
import { useNavigate } from 'react-router-dom';

interface CalendarPost {
  id: string;
  title: string;
  content?: string;
  start: string; // ISO date-time
  platform?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  color?: string;
}

interface CalendarResponse { posts: CalendarPost[] }

const Planner = () => {

  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarPosts, setCalendarPosts] = useState<CalendarPost[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchCalendar = async () => {
    const res = await postsApi.getCalendarPosts() as unknown as { success: boolean; data?: CalendarResponse };
    if (res.success && res.data?.posts) {
      setCalendarPosts(res.data.posts);
    } else {
      setCalendarPosts([]);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  // Simple calendar view for demo
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  };

  const getPostsForDate = (day: number) => {
    if (!day) return [] as CalendarPost[];
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return calendarPosts.filter((post) => {
      const postDate = new Date(post.start);
      return postDate.toDateString() === targetDate.toDateString();
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') newDate.setMonth(newDate.getMonth() - 1);
      else newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

 

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="font-heading text-3xl font-bold text-gray-900">Planner</h1>
          <p className="text-gray-600 mt-1">Plan and schedule your social media posts</p>
        </div>
        <div className="flex mb-5 md:mb-0 space-x-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={() => navigate("/dashboard/createpost")}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
            </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigateMonth('prev')}>
              ←
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" onClick={() => navigateMonth('next')}>
              →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {dayNames.map((day) => (
              <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
            {getDaysInMonth(currentDate).map((day, index) => (
              <div key={index} className="bg-white min-h-[120px] p-2 relative">
                {day && (
                  <>
                    <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                    <div className="space-y-1">
                      {getPostsForDate(day).slice(0, 3).map((post) => (
                        <div
                          key={post.id}
                          className="text-xs p-1 rounded bg-red-50 text-red-700 truncate cursor-pointer hover:bg-red-100"
                        >
                          {post.title}
                        </div>
                      ))}
                      {getPostsForDate(day).length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{getPostsForDate(day).length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Upcoming Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calendarPosts
              .filter((p) => p.status === 'scheduled')
              .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
              .map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{post.title}</h3>
                      {post.content && <p className="text-sm text-gray-600 mt-1">{post.content}</p>}
                    </div>
                    <Badge variant="secondary">{post.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {post.platform && (
                        <Badge key={post.platform} variant="outline" className="text-xs">
                          {post.platform}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      <CalendarIcon className="inline h-4 w-4 mr-1" />
                      {new Date(post.start).toLocaleDateString()} at{' '}
                      {new Date(post.start).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <CreatePostDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={fetchCalendar}
        defaultDate={new Date()}
      />
    </div>
  );
};

export default Planner;
