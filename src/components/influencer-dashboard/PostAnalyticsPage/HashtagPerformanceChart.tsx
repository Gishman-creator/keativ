import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  TooltipProps,
} from "recharts"

const COLORS = {
  text: "#2D3748",
  background: "#FFFFFF",
  primary: "#EF4444", // Likes / primary accents
  secondary: "#8B5CF6", // Comments / secondary accents
  accent: "#F3F4F6", // surfaces
  muted: "#CBD5E0", // axis/grid
  gray: "#A0AEC0",
  green: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",
}

interface HashtagPerformanceChartProps {
  hashtags: { tag: string; impressions: number; engagement: number }[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 text-sm shadow-sm">
        <p className="font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }

  return null
}

export function HashtagPerformanceChart({ hashtags }: HashtagPerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={hashtags} barGap={6}>
        <CartesianGrid stroke={COLORS.muted} vertical={false} />
        <XAxis dataKey="tag" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis dataKey="impressions" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="impressions" fill={COLORS.purple} radius={[6, 6, 0, 0]} name="Impressions" />
        <Bar dataKey="engagement" fill={COLORS.primary} radius={[6, 6, 0, 0]} name="Engagement" />
      </BarChart>
    </ResponsiveContainer>
  )
}
