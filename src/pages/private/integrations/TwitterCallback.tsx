import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, ApiResponse, TwitterCallbackResponse, BindTwitterTokensPayload } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TwitterCallback = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const [status, setStatus] = useState<'working' | 'success' | 'error'>('working');
  const [message, setMessage] = useState<string>('Completing connection...');

  useEffect(() => {
    const complete = async () => {
      const code = query.get('code');
      const state = query.get('state') || undefined;
      if (!code) {
        setStatus('error');
        setMessage('Missing authorization code');
        return;
      }

      const cbRes: ApiResponse<TwitterCallbackResponse> = await api.twitterCallback({ code, state });
      if (!cbRes.success || !cbRes.data) {
        setStatus('error');
        setMessage(cbRes.error || 'Failed to exchange code');
        return;
      }

      const payload: BindTwitterTokensPayload = {
        account: cbRes.data.account,
        tokens: cbRes.data.tokens,
      };

      const bindRes = await api.bindTwitterTokens(payload);
      if (bindRes.success) {
        setStatus('success');
        setMessage('Twitter connected! Redirecting...');
        setTimeout(() => navigate('/dashboard/integrations'), 1200);
      } else {
        setStatus('error');
        setMessage(bindRes.error || 'Failed to bind tokens');
      }
    };

    complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Twitter Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`${status === 'error' ? 'text-red-600' : status === 'success' ? 'text-green-600' : 'text-gray-700'}`}>{message}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterCallback;
