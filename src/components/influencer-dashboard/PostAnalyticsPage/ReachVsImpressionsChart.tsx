import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { format } from "date-fns"

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

interface ReachVsImpressionsChartProps {
  data: { label: string; reach: number; impressions: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-4 shadow-sm">
        <p className="text-sm font-bold mb-2">{label}</p>
        <div className="grid gap-2">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-800">
                {entry.value} {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export function ReachVsImpressionsChart({ data }: ReachVsImpressionsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={256}>
      <AreaChart data={data}>
        <CartesianGrid stroke={COLORS.muted} vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} style={{ fontSize: '12px' }} />
        <YAxis tickLine={false} axisLine={false} style={{ fontSize: '12px' }} />
        <Tooltip cursor={false} content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="reach"
          stroke={COLORS.green}
          fill={COLORS.green}
          fillOpacity={0.12}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="impressions"
          stroke={COLORS.purple}
          fill={COLORS.purple}
          fillOpacity={0.12}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
