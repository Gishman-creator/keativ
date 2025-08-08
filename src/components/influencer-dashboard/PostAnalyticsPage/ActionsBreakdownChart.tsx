import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
  Legend,
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

interface ActionsBreakdownChartProps {
  actions: {
    profileVisits: number;
    linkClicks: number;
    follows: number;
  };
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

export function ActionsBreakdownChart({ actions }: ActionsBreakdownChartProps) {
  const data = [
    { type: "Profile visits", value: actions.profileVisits, color: COLORS.secondary, name: "Profile visits" },
    { type: "Link clicks", value: actions.linkClicks, color: COLORS.primary, name: "Link clicks" },
    { type: "Follows", value: actions.follows, color: COLORS.green, name: "Follows" },
  ];

  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid stroke={COLORS.muted} vertical={false} />
        <XAxis dataKey="type" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
