import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { TwitterAccount, Tweet, TwitterPost } from '@/lib/api';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const TwitterCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<TwitterAccount | null>(null);
  const [lastTweet, setLastTweet] = useState<TwitterPost | null>(null);
  const [userTweets, setUserTweets] = useState<Tweet[]>([]);

  const handleVerifyCredentials = async () => {
    setIsLoading(true);
    setError(null);
    setAccount(null);
    const response = await api.verifyTwitterCredentials();
    if (response.success && response.data) {
      setAccount(response.data.account);
    } else {
      setError(response.error || 'Failed to verify Twitter credentials.');
    }
    setIsLoading(false);
  };

  const handlePostTweet = async () => {
    setIsLoading(true);
    setError(null);
    setLastTweet(null);
    const testTweet = {
      tweet_text: `This is a test tweet from SMMS! Time: ${new Date().toLocaleTimeString()}`,
    };
    const response = await api.postTweet(testTweet);
    if (response.success && response.data) {
      setLastTweet(response.data.tweet);
    } else {
      setError(response.error || 'Failed to post tweet.');
    }
    setIsLoading(false);
  };

  const handleGetUserTweets = async () => {
    setIsLoading(true);
    setError(null);
    setUserTweets([]);
    const response = await api.getUserTweets(5);
    if (response.success && response.data) {
      setUserTweets(response.data.tweets);
    } else {
      setError(response.error || 'Failed to get user tweets.');
    }
    setIsLoading(false);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Twitter Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleVerifyCredentials} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verify Credentials
          </Button>
          <Button onClick={handlePostTweet} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Post Test Tweet
          </Button>
          <Button onClick={handleGetUserTweets} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Get My Tweets
          </Button>
        </div>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {account && (
          <div className="text-green-700 bg-green-100 p-3 rounded-md">
            <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <p className="font-bold">Credentials Verified!</p>
            </div>
            <p>Username: @{account.username}</p>
            <p>Name: {account.name}</p>
            <p>Followers: {account.followers_count}</p>
          </div>
        )}

        {lastTweet && (
          <div className="text-blue-700 bg-blue-100 p-3 rounded-md">
            <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <p className="font-bold">Tweet Posted!</p>
            </div>
            <p>ID: {lastTweet.tweet_id}</p>
            <p>Text: {lastTweet.text}</p>
            <a href={lastTweet.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Tweet</a>
          </div>
        )}

        {userTweets.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Recent Tweets:</h4>
            <ul className="space-y-2">
              {userTweets.map(tweet => (
                <li key={tweet.id} className="text-sm p-2 border rounded-md">
                  <p>{tweet.text}</p>
                  <span className="text-xs text-gray-500">{new Date(tweet.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwitterCard;
