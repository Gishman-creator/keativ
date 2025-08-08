import * as React from "react"
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { Frown, Meh, MessageCircle, Share2, ThumbsDown, ThumbsUp } from "lucide-react"

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

interface CommentSentimentChartProps {
  sentiment: { name: string; value: number }[];
}

export function CommentSentimentChart({ sentiment }: CommentSentimentChartProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-4">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Tooltip />
          <Pie
            data={sentiment}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={6}
          >
            {sentiment.map((s) => (
              <Cell key={s.name} fill={
                s.name === "Positive" ? COLORS.green :
                  s.name === "Neutral" ? COLORS.amber :
                    COLORS.red
              } />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <ul className="text-sm space-y-1">
        <li className="flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-[#10B981]" /> Positive</li>
        <li className="flex items-center gap-2"><Meh className="h-4 w-4 text-[#F59E0B]" /> Neutral</li>
        <li className="flex items-center gap-2"><ThumbsDown className="h-4 w-4 text-[#EF4444]" /> Negative</li>
      </ul>
    </div>
  )
}
