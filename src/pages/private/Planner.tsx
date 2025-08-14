import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Calendar from './Calendar';
import Posts from './Posts';
import { useSearchParams } from 'react-router-dom';

const Planner: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'posts' ? 'posts' : 'calendar';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Planner</h1>
          <p className="text-gray-600 mt-1">Plan, compose, and schedule your social content</p>
        </div>
      </div>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Calendar />
        </TabsContent>
        <TabsContent value="posts">
          <Posts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Planner;
