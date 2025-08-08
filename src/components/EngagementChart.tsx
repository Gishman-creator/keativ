import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { API_ENDPOINTS } from '@/config/constants';
import { api } from '@/lib/api';

// Shape of each averaged entry coming from backend
interface PlatformAveragePoint {
  platform: string;
  avg_impressions: number;
  avg_reach: number;
  avg_engagement_rate: number;
  avg_likes: number;
  avg_shares: number;
  avg_comments: number;
  period: string; // e.g. "2025-01-01 to 2025-01-07"
}

// Chart row shape (dynamic keys for platforms)
interface ChartRow {
  name: string;
  [platform: string]: string | number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px' }}>
        <p className="font-semibold text-black mb-2">{`${label}`}</p>
        {payload.map((pld) => (
          <div key={pld.dataKey as string} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: pld.color as string }}
            ></div>
            <span className="text-black">{`${pld.value} ${pld.name}`}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default function EngagementChart({ height = 300 }: { height?: number }) {
  const [data, setData] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      // We use platform averages weekly to simulate an over-time series; we'll group by period
      const res = await api.get<PlatformAveragePoint[]>(`${API_ENDPOINTS.ANALYTICS.PLATFORM_AVERAGES}?period=weekly`);
      if (!isMounted) return;
      if (res.success && Array.isArray(res.data)) {
        // Group by period label
        const byPeriod: Record<string, ChartRow> = {};
        res.data.forEach((pt) => {
          const label = pt.period;
          if (!byPeriod[label]) {
            byPeriod[label] = { name: label };
          }
          // Use engagement rate per platform as the series
          const key = (pt.platform || 'overall').toLowerCase();
          byPeriod[label][key] = Math.round((pt.avg_engagement_rate || 0) * 100) / 100;
        });
        const chartData = Object.values(byPeriod);
        setData(chartData);
      } else {
        setError(typeof res.error === 'string' ? res.error : 'Failed to load engagement data');
      }
      setLoading(false);
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <div className="pt-2 px-6 text-sm text-gray-500">Loading engagement data…</div>;
  }

  if (error) {
    return <div className="pt-2 px-6 text-sm text-red-600">{error}</div>;
  }

  if (!data.length) {
    return <div className="pt-2 px-6 text-sm text-gray-500">No engagement data available</div>;
  }

  // Determine dynamic platform keys from the first row (exclude name field)
  const seriesKeys = Object.keys(data[0]).filter((k) => k !== 'name');
  const colorMap: Record<string, string> = {
    instagram: '#E1306C',
    twitter: '#1DA1F2',
    facebook: '#1877F2',
    linkedin: '#0A66C2',
    overall: '#9CA3AF',
  };

  return (
    <div className="pt-2 px-6">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 10 }}>
          <CartesianGrid horizontal={true} vertical={false} stroke="#e0e0e0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={40} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {seriesKeys.map((key) => (
            <Line key={key} type="monotone" dataKey={key} stroke={colorMap[key] || '#EF4444'} strokeWidth={2} dot={false} name={key.charAt(0).toUpperCase() + key.slice(1)} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}