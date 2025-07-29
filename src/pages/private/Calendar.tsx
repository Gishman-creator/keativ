import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus, Filter } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Calendar = () => {
  const posts = useSelector((state: RootState) => state.posts.posts);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Simple calendar view for demo
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getPostsForDate = (day: number) => {
    if (!day) return [];
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return posts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return postDate.toDateString() === targetDate.toDateString();
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600 mt-1">Plan and schedule your social media posts</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-red-500 hover:bg-red-600">
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
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
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

      {/* Upcoming Posts List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Upcoming Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts
              .filter(post => post.status === 'scheduled')
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                    </div>
                    <Badge variant="secondary">{post.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {post.platforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      <CalendarIcon className="inline h-4 w-4 mr-1" />
                      {new Date(post.scheduledDate).toLocaleDateString()} at{' '}
                      {new Date(post.scheduledDate).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;