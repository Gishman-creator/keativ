import * as React from "react"
import { useParams } from "react-router-dom"
import { ArrowLeft, CalendarClock, ExternalLink, LinkIcon, MessageCircle, MousePointerClick, Save, Share2, ThumbsUp } from 'lucide-react'
import { Instagram, Facebook, Linkedin } from 'lucide-react'; // Import icons directly

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ReachVsImpressionsChart } from "@/components/influencer-dashboard/PostAnalyticsPage/ReachVsImpressionsChart"
import { ActionsBreakdownChart } from "@/components/influencer-dashboard/PostAnalyticsPage/ActionsBreakdownChart"
import { CommentSentimentChart } from "@/components/influencer-dashboard/PostAnalyticsPage/CommentSentimentChart"
import { HashtagPerformanceChart } from "@/components/influencer-dashboard/PostAnalyticsPage/HashtagPerformanceChart"

type Timeframe = "24h" | "7d" | "30d"

const COLORS = {
  text: "hsl(var(--foreground))",
  background: "hsl(var(--background))",
  primary: "hsl(var(--primary))", // Likes / primary accents
  secondary: "hsl(var(--secondary))", // Comments / secondary accents
  accent: "hsl(var(--accent))", // surfaces
  muted: "hsl(var(--muted))", // axis/grid
  gray: "hsl(var(--muted-foreground))",
  green: "hsl(var(--chart-1))", // Using chart colors for specific data points
  amber: "hsl(var(--chart-2))",
  red: "hsl(var(--destructive))",
  purple: "hsl(var(--chart-3))",
}

const socialPlatforms = [
  {
    id: "instagram",
    name: "Instagram",
    logo: "/public/social media/instagram-logo.png",
    bgColor: "#E1306C", // A more fitting Instagram-like color (reddish-pink)
    profile: "https://picsum.photos/id/1012/200/200", // Alex Rivera's image
  },
  {
    id: "facebook",
    name: "Facebook",
    logo: "/public/social media/facebook-logo.png",
    bgColor: "#1877F2",
    profile: "https://picsum.photos/id/1005/200/200", // Sarah Johnson's image
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    logo: "/public/social media/linkedin-logo.png",
    bgColor: "#0A66C2",
    profile: "https://picsum.photos/id/1011/200/200", // Michael Chen's image
  },
]

// Mock post (frontend only)
const mockPost = {
  id: "123",
  platform: "instagram",
  title: "Spring Launch Collection",
  caption:
    "Throwback to our spring launch 🌸 New colors, same minimal vibes. What do you think? #keativ #minimal #design",
  postedAt: "2025-08-01T14:00:00Z",
  media: "/image-placeholder.png?height=400&width=400",
  link: "#",
  status: "Published",
}

// Utility to format date labels
function formatLabel(d: Date, tf: Timeframe) {
  if (tf === "24h") {
    return d.toLocaleTimeString(undefined, { hour: "numeric" })
  }
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

// Create mock time series data for a single post
function generateSeries(tf: Timeframe) {
  const now = new Date()
  const points =
    tf === "24h" ? 24 : tf === "7d" ? 7 : 30
  const stepMs =
    tf === "24h" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000

  const baseReach = tf === "24h" ? 200 : tf === "7d" ? 350 : 500
  const baseImpr = baseReach * 2.2
  const baseLikes = tf === "24h" ? 20 : tf === "7d" ? 35 : 45
  const baseComments = tf === "24h" ? 3 : tf === "7d" ? 4 : 5
  const baseSaves = tf === "24h" ? 5 : tf === "7d" ? 8 : 10

  const series = Array.from({ length: points }, (_, i) => {
    const t = new Date(now.getTime() - (points - 1 - i) * stepMs)
    const dayFactor = 0.8 + Math.sin((i / points) * Math.PI) * 0.6
    const noise = 0.85 + Math.random() * 0.3
    const reach = Math.round(baseReach * dayFactor * noise)
    const impressions = Math.round(baseImpr * dayFactor * (0.9 + Math.random() * 0.4))
    const likes = Math.round(baseLikes * dayFactor * (0.9 + Math.random() * 0.5))
    const comments = Math.round(baseComments * dayFactor * (0.8 + Math.random() * 0.7))
    const saves = Math.round(baseSaves * dayFactor * (0.85 + Math.random() * 0.4))
    const shares = Math.max(0, Math.round(likes * 0.15 * (0.8 + Math.random() * 0.5)))
    const clicks = Math.round(reach * 0.08 * (0.8 + Math.random() * 0.7))
    return {
      label: formatLabel(t, tf),
      reach,
      impressions,
      likes,
      comments,
      saves,
      shares,
      clicks,
      er: +(likes + comments + saves + shares) / Math.max(1, impressions), // simple engagement rate
    }
  })
  console.log("Series:", series);

  return series
}

// Aggregated KPIs from series
function aggregate(series: ReturnType<typeof generateSeries>) {
  const sum = series.reduce(
    (acc, p) => {
      acc.reach += p.reach
      acc.impressions += p.impressions
      acc.likes += p.likes
      acc.comments += p.comments
      acc.saves += p.saves
      acc.shares += p.shares
      acc.clicks += p.clicks
      return acc
    },
    { reach: 0, impressions: 0, likes: 0, comments: 0, saves: 0, shares: 0, clicks: 0 }
  )
  const er =
    series.reduce((acc, p) => acc + p.er, 0) / Math.max(1, series.length)

  // Actions breakdown (mock proportions)
  const actions = {
    profileVisits: Math.round(sum.clicks * 0.45),
    linkClicks: Math.round(sum.clicks * 0.4),
    follows: Math.round(sum.clicks * 0.15),
  }

  // Sentiment (mocked AI)
  const sentiment = [
    { name: "Positive", value: Math.max(1, Math.round(sum.comments * 0.55)) },
    { name: "Neutral", value: Math.max(1, Math.round(sum.comments * 0.30)) },
    { name: "Negative", value: Math.max(1, Math.round(sum.comments * 0.15)) },
  ]

  // Hashtag performance (mock)
  const hashtags = [
    { tag: "#keativ", impressions: Math.round(sum.impressions * 0.18), engagement: Math.round(sum.likes * 0.22) },
    { tag: "#minimal", impressions: Math.round(sum.impressions * 0.13), engagement: Math.round(sum.likes * 0.18) },
    { tag: "#design", impressions: Math.round(sum.impressions * 0.16), engagement: Math.round(sum.likes * 0.2) },
    { tag: "#spring", impressions: Math.round(sum.impressions * 0.1), engagement: Math.round(sum.likes * 0.12) },
    { tag: "#brand", impressions: Math.round(sum.impressions * 0.08), engagement: Math.round(sum.likes * 0.1) },
  ]

  return { sum, er, actions, sentiment, hashtags }
}

export default function PostAnalyticsPage() {
  const { id: postId } = useParams<{ id: string }>();
  const [timeframe, setTimeframe] = React.useState<Timeframe>("7d")
  const [selectedPlatformId, setSelectedPlatformId] = React.useState<string | null>(socialPlatforms[0].id); // Initialize with the first platform
  const series = React.useMemo(() => generateSeries(timeframe), [timeframe])
  const { sum, er, actions, sentiment, hashtags } = React.useMemo(() => aggregate(series), [series])

  const engagementMeta = React.useMemo(() => {
    if (!series?.length) {
      return { total: 0, avg: 0, peakLabel: "—", peakValue: 0 }
    }
    let total = 0
    let peakValue = -1
    let peakLabel = series[0].label
    for (const p of series) {
      const val = (p.likes ?? 0) + (p.comments ?? 0) + (p.saves ?? 0)
      total += val
      if (val > peakValue) {
        peakValue = val
        peakLabel = p.label
      }
    }
    const avg = total / series.length
    return { total, avg, peakLabel, peakValue }
  }, [series])

  const post = mockPost
  // const postId = params?.id ?? post.id // This line is no longer needed as postId is now from useParams

  return (
    <main className={`min-h-screen bg-[#FFFFFF] text-[#2D3748]`}>
      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-6">
        {/* Post preview and meta */}
        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6">
          <Card className="border-[#E5E7EB]">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center justify-between gap-2">
                  {socialPlatforms.map((platform) => {
                    const IconComponent = platform.name === "Instagram" ? Instagram : platform.name === "Facebook" ? Facebook : Linkedin;
                    const isSelected = selectedPlatformId === platform.id;
                    return (
                      <div
                        key={platform.id}
                        className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => setSelectedPlatformId(platform.id)}
                      >
                        <img
                          src={platform.profile || "/image-placeholder.png"}
                          alt="Profile"
                          className={`w-full h-full object-cover rounded-full ${isSelected ? "border-[3px] border-secondary" : ""}`}
                        />
                        <div
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: platform.bgColor }}
                        >
                          <IconComponent size={12} className="text-white" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Badge className="bg-[#10B981] text-white">Live</Badge>
              </div>
              <CardTitle className='text-lg'>{post.title}</CardTitle>
              <CardDescription className="text-sm">
                Published{" "}
                <time dateTime={post.postedAt}>
                  {new Date(post.postedAt).toLocaleString()}
                </time>
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-lg overflow-hidden border bg-white">
                <img
                  src={post.media || "/image-placeholder.png"}
                  alt="Post media preview"
                  width={720}
                  height={720}
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="leading-6">
                {post.caption.split(/(#\w+)/g).map((part, index) =>
                  part.startsWith("#") ? (
                    <span key={index} className="text-blue-600">
                      {part}
                    </span>
                  ) : (
                    part
                  )
                )}
              </p>
              <div className="flex items-center gap-2">
                <Button className="h-8 bg-[#EF4444] hover:bg-[#dc2626]">Open post</Button>
                <Button variant="outline" className="h-8 text-[#2D3748] border-[#E5E7EB] hover:bg-[#F3F4F6]">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Copy link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* KPIs and timeframe */}
          <div className="grid gap-4">
            <Card className="border-[#E5E7EB]">
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className={`text-base`}>Overview</CardTitle>
                  <CardDescription>Post ID: {postId}</CardDescription>
                </div>
                <div className="flex items-center gap-1 rounded-md bg-[#F3F4F6] p-1">
                  {(["24h", "7d", "30d"] as Timeframe[]).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`h-8 px-3 rounded ${timeframe === tf ? "bg-[#EF4444] text-white" : "text-[#2D3748] hover:bg-white/60"}`}
                      aria-pressed={timeframe === tf}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <KpiCard label="Reach" value={sum.reach} accent="border-[#F3F4F6]" />
                  <KpiCard label="Impressions" value={sum.impressions} accent="border-[#F3F4F6]" />
                  <KpiCard label="Engagement rate" value={`${(er * 100).toFixed(2)}%`} accent="border-[#F3F4F6]" />
                  <KpiCard label="Clicks" value={sum.clicks} accent="border-[#F3F4F6]" />
                  <KpiCard icon={<ThumbsUp className="h-4 w-4 text-[#EF4444]" />} label="Likes" value={sum.likes} />
                  <KpiCard icon={<MessageCircle className="h-4 w-4 text-[#8B5CF6]" />} label="Comments" value={sum.comments} />
                  <KpiCard icon={<Save className="h-4 w-4 text-[#2D3748]" />} label="Saves" value={sum.saves} />
                  <KpiCard icon={<Share2 className="h-4 w-4 text-[#2D3748]" />} label="Shares" value={sum.shares} />
                </div>
              </CardContent>
            </Card>

            {/* Engagement over time */}
            <Card className="border-[#E5E7EB]">
              <CardHeader>
                <CardTitle className={`text-base`}>Engagement over time</CardTitle>
                <CardDescription>Likes, comments, and saves across {timeframe}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-md border border-[#E5E7EB] bg-white p-3">
                    <div className="text-xs text-[#4A5568]">Total engagement</div>
                    <div className="mt-1 text-lg font-medium">
                      {(engagementMeta.total).toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs text-[#4A5568]">
                      Likes + Comments + Saves
                    </div>
                  </div>
                  <div className="rounded-md border border-[#E5E7EB] bg-white p-3">
                    <div className="text-xs text-[#4A5568]">Peak interval</div>
                    <div className="mt-1 text-lg font-medium">
                      {engagementMeta.peakLabel}
                    </div>
                    <div className="mt-1 text-xs text-[#4A5568]">
                      {engagementMeta.peakValue.toLocaleString()} interactions
                    </div>
                  </div>
                  <div className="rounded-md border border-[#E5E7EB] bg-white p-3">
                    <div className="text-xs text-[#4A5568]">Avg per interval</div>
                    <div className="mt-1 text-lg font-medium">
                      {Math.round(engagementMeta.avg).toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs text-[#4A5568]">
                      Based on {series.length} points
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts row: reach vs impressions + actions breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className={`text-base`}>Reach vs Impressions</CardTitle>
              <CardDescription>How many unique accounts reached vs total views</CardDescription>
            </CardHeader>
            <CardContent>
              <ReachVsImpressionsChart data={series} />
            </CardContent>
          </Card>

          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className={`text-base`}>Actions breakdown</CardTitle>
              <CardDescription>Post-driven actions (profile visits, link clicks, follows)</CardDescription>
            </CardHeader>
            <CardContent>
              <ActionsBreakdownChart actions={actions} />
              <div className="mt-3 flex items-center gap-3 text-sm">
                <MousePointerClick className="h-4 w-4 text-[#2D3748]" />
                CTR
                <span className="font-medium ml-1">
                  {sum.impressions ? `${((actions.linkClicks / sum.impressions) * 100).toFixed(2)}%` : "0%"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts row: sentiment + hashtag performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className={`text-base`}>Comment sentiment (mock AI)</CardTitle>
              <CardDescription>Automated sentiment analysis of comments</CardDescription>
            </CardHeader>
            <CardContent>
              <CommentSentimentChart sentiment={sentiment} />
            </CardContent>
          </Card>

          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className={`text-base`}>Hashtag performance</CardTitle>
              <CardDescription>Impressions and engagement by hashtag</CardDescription>
            </CardHeader>
            <CardContent>
              <HashtagPerformanceChart hashtags={hashtags} />
            </CardContent>
          </Card>
        </div>

        {/* Footer meta */}
        <div className="grid gap-2 text-xs text-[#4A5568]">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            Last updated{" "}
            {new Date().toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </div>
        </div>
      </div>
    </main>
  )
}

function KpiCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: number | string
  icon?: React.ReactNode
  accent?: string
}) {
  return (
    <div className={`rounded-md border bg-white p-3 ${accent ?? "border-[#E5E7EB]"}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#4A5568]">{label}</span>
        {icon ?? null}
      </div>
      <div className={`mt-1 text-lg`}>{value}</div>
    </div>
  )
}
