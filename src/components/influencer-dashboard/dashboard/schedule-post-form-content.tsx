"use client"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, Hash, Facebook, Instagram, Linkedin, X, Sparkles, Lightbulb, RefreshCw, Copy, Check, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { API_ENDPOINTS } from "@/config/constants"
import { Badge } from "@/components/ui/badge"


const socialPlatforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "#E4405F",
    bgColor: "#E1306C",
    profile: "https://picsum.photos/id/1012/200/200", // Alex Rivera's image
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "#1877F2",
    bgColor: "#1877F2",
    profile: "https://picsum.photos/id/1005/200/200", // Sarah Johnson's image
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    bgColor: "#0A66C2",
    profile: "https://picsum.photos/id/1011/200/200", // Michael Chen's image
  },
]

const suggestedHashtags = [
  "#socialmedia",
  "#marketing",
  "#business",
  "#entrepreneur",
  "#success",
  "#motivation",
  "#inspiration",
  "#growth",
  "#innovation",
  "#digital",
]

interface SchedulePostFormContentProps {
  showImageModal: boolean;
  setShowImageModal: (show: boolean) => void;
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  isLargeScreen: boolean;
  handleCloseSchedulePostPage: () => void;
}

function SchedulePostFormContent({
  showImageModal,
  setShowImageModal,
  selectedImages,
  setSelectedImages,
  isLargeScreen,
  handleCloseSchedulePostPage,
}: SchedulePostFormContentProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("12:00")
  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // AI States
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [contentSuggestions, setContentSuggestions] = useState<string[]>([])
  const [isRefreshingHashtags, setIsRefreshingHashtags] = useState(false)
  const [aiHashtags, setAiHashtags] = useState<string[]>([])
  const [isLoadingTimes, setIsLoadingTimes] = useState(false)
  const [optimalTimes, setOptimalTimes] = useState<string[]>([])
  const [currentHashtags, setCurrentHashtags] = useState<string[]>(["#Keativ", "#Business"])

  const handleGenerateContent = async () => {
    if (!selectedPlatforms.length) return;
    setIsGeneratingContent(true);
    try {
      const res = await api.post<{ suggestions: string[] }>(API_ENDPOINTS.POSTS.AI_CONTENT_SUGGESTIONS, {
        platform: selectedPlatforms[0],
        topic: title || "Social Media Content"
      });
      if (res.success && res.data?.suggestions) {
        setContentSuggestions(res.data.suggestions);
      }
    } catch (e) {
      console.error("Failed to generate content", e);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleRefreshHashtags = async () => {
    setIsRefreshingHashtags(true);
    try {
      const res = await api.post<{ hashtags: string[] }>(API_ENDPOINTS.INTEGRATIONS.HASHTAG_SUGGEST, {
        content: caption || title,
        platform: selectedPlatforms[0] || "instagram"
      });
      if (res.success && res.data?.hashtags) {
        setAiHashtags(res.data.hashtags);
      }
    } catch (e) {
      console.error("Failed to suggest hashtags", e);
    } finally {
      setIsRefreshingHashtags(false);
    }
  };

  const handleRefreshTimes = async () => {
    setIsLoadingTimes(true);
    try {
      const res = await api.get<{ optimal_times: string[] }>(API_ENDPOINTS.INTEGRATIONS.OPTIMAL_TIMES);
      if (res.success && res.data?.optimal_times) {
        setOptimalTimes(res.data.optimal_times);
      }
    } catch (e) {
      console.error("Failed to get optimal times", e);
    } finally {
      setIsLoadingTimes(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!title || !date) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        content: caption,
        scheduled_time: `${format(date, 'yyyy-MM-dd')}T${time}:00Z`,
        platform: selectedPlatforms[0] || "instagram",
        status: 'scheduled'
      };
      const res = await api.post(API_ENDPOINTS.POSTS.CREATE, payload);
      if (res.success) {
        handleCloseSchedulePostPage();
      }
    } catch (e) {
      console.error("Failed to schedule post", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
  }

  const addHashtag = (hashtag: string) => {
    setCaption((prev) => prev + " " + hashtag)
  }

  const characterCount = caption.length
  const maxCharacters = 280

  return (
    <div
      className={cn(
        "w-full pt-4 pl-4 bg-white rounded-lg h-full flex flex-col", // Added flex flex-col
        showImageModal && isLargeScreen ? "lg:w-full" : "lg:w-full",
      )}
    >
      {/* Header */}
      <div className="mb-6 flex justify-between items-center flex-shrink-0 pr-4">
        <h2 className="text-[#2D3748] font-['Roboto_Slab'] text-lg font-semibold">Schedule Your Post</h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700"
          onClick={handleCloseSchedulePostPage}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 pr-4"> {/* Changed height to flex-1 */}
        <div className="space-y-6 font-['Poppins']">
          {/* Platform Selection */}
          <div className="space-y-3">
            <Label className="text-[#2D3748] font-medium">Select Accounts</Label>
            <div className="flex space-x-4">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon
                const isSelected = selectedPlatforms.includes(platform.id)
                return (
                  <div
                    key={platform.id}
                    className="relative group cursor-pointer"
                    onClick={() => handlePlatformToggle(platform.id)}
                  >
                    {/* Profile Circle */}
                    <div
                      className={cn(
                        "relative w-12 h-12 rounded-full transition-all duration-300 group-hover:scale-110",
                        isSelected ? "border-2 border-[#8B5CF6]" : "border-2 border-transparent group-hover:border-[#8B5CF6]/50",
                      )}
                    >
                      <img
                        src={platform.profile || "/image-placeholder.png"}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* Social Media Icon - Outside bottom right */}
                    <div
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 z-10"
                      style={{ backgroundColor: platform.bgColor }}
                    >
                      <Icon size={12} className="text-white" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator className="bg-[#F3F4F6]" />

          {/* Date and Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#2D3748] font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-[#F3F4F6]",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-[#8B5CF6]" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-[#2D3748] font-medium">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-[#8B5CF6]" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10 border-[#F3F4F6] focus:border-[#EF4444]"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-[#F3F4F6]" />

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-[#2D3748] font-medium">Title</Label>
            <Input
              placeholder="Enter your post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-[#F3F4F6] focus:border-[#EF4444] text-[#2D3748]"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-[#2D3748] font-medium">Caption</Label>
              <span className={cn("text-sm", characterCount > maxCharacters ? "text-[#EF4444]" : "text-[#8B5CF6]")}>
                {characterCount}/{maxCharacters}
              </span>
            </div>
            <div className="relative">
              <Textarea
                placeholder="Write your caption here..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[120px] border-[#F3F4F6] focus:border-[#EF4444] text-[#2D3748] resize-none rounded-md"
              />
            </div>
          </div>

          <Separator className="bg-[#F3F4F6]" />

          {/* AI Content Suggestions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
                <Label className="text-[#2D3748] font-medium">Content Suggestions</Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#8B5CF6] hover:text-[#7C3AED] h-7 px-2"
                onClick={handleGenerateContent}
                disabled={isGeneratingContent || !selectedPlatforms.length}
              >
                {isGeneratingContent ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                Generate
              </Button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 min-h-[100px] flex flex-col justify-center items-center text-center">
              {contentSuggestions.length > 0 ? (
                <div className="space-y-3 w-full">
                  {contentSuggestions.map((suggestion, i) => (
                    <div key={i} className="bg-white p-3 rounded-md border border-gray-200 text-sm text-gray-700 text-left relative group">
                      <p>{suggestion}</p>
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setCaption(suggestion)} title="Use this content">
                          <Check className="h-3 w-3 text-green-500" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(suggestion)} title="Copy to clipboard">
                          <Copy className="h-3 w-3 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-gray-400 flex items-center justify-center">
                    <Lightbulb className="h-3 w-3 mr-1" /> 
                    Click "Use" to replace your content, or "Copy" to save suggestions for later
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500">No suggestions generated yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click Generate to get AI-powered content ideas</p>
                </>
              )}
            </div>
          </div>

          <Separator className="bg-[#F3F4F6]" />

          {/* AI Hashtag Suggestions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-[#8B5CF6]" />
                <Label className="text-[#2D3748] font-medium">Hashtag Suggestions</Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#8B5CF6] hover:text-[#7C3AED] h-7 px-2"
                onClick={handleRefreshHashtags}
                disabled={isRefreshingHashtags}
              >
                <RefreshCw className={cn("h-3 w-3 mr-1", isRefreshingHashtags && "animate-spin")} />
                Refresh
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Current Hashtags:</p>
                <div className="flex flex-wrap gap-2">
                  {currentHashtags.map(h => (
                    <Badge key={h} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 cursor-pointer" onClick={() => setCurrentHashtags(prev => prev.filter(x => x !== h))}>
                      {h} ×
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Suggested Hashtags:</p>
                <div className="flex flex-wrap gap-2">
                  {(aiHashtags.length > 0 ? aiHashtags : suggestedHashtags).map(h => (
                    <Badge 
                      key={h} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]/30 transition-colors"
                      onClick={() => {
                        if (!currentHashtags.includes(h)) {
                          setCurrentHashtags(prev => [...prev, h]);
                          addHashtag(h);
                        }
                      }}
                    >
                      {h}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 flex items-center">
                <Lightbulb className="h-3 w-3 mr-1" />
                Click suggested hashtags to add them, or click current hashtags to remove them
              </p>
            </div>
          </div>

          <Separator className="bg-[#F3F4F6]" />

          {/* AI Optimal Posting Times */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-[#8B5CF6]" />
                <Label className="text-[#2D3748] font-medium">Optimal Posting Times</Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#8B5CF6] hover:text-[#7C3AED] h-7 px-2"
                onClick={handleRefreshTimes}
                disabled={isLoadingTimes}
              >
                <RefreshCw className={cn("h-3 w-3 mr-1", isLoadingTimes && "animate-spin")} />
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(optimalTimes.length > 0 ? optimalTimes : ["Tomorrow, 2:00 PM", "Monday, 9:00 AM"]).map((t, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  className={cn("text-xs h-9 justify-start font-normal border-gray-200", i === 0 && "border-[#8B5CF6] bg-indigo-50/50")}
                  onClick={() => {
                     // Set time if format allows, else just a hint
                     if (t.includes(':')) {
                        const timeMatch = t.match(/(\d{1,2}:\d{2})\s*(AM|PM)?/i);
                        if (timeMatch) setTime(timeMatch[1]);
                     }
                  }}
                >
                  <Sparkles className="h-3 w-3 mr-2 text-amber-400" />
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-[#F3F4F6]" />

          {/* Image Upload */}
          <div className="space-y-3">
            <Label className="text-[#2D3748] font-medium">Attached Images</Label>
            <div className="flex flex-wrap gap-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative w-32 h-32">
                  <img
                    src={URL.createObjectURL(image) || "/image-placeholder.png"}
                    alt={`Attached ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={() => setSelectedImages((prev: File[]) => prev.filter((_, i) => i !== index))}
                  >
                    ×
                  </Button>
                </div>
              ))}

              {selectedImages.length === 0 && (
                <div className="relative w-32 h-32 rounded-lg flex items-center justify-center group cursor-pointer">
                  <img
                    src="/public/image-placeholder.png"
                    alt="Placeholder"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              <div
                className="w-32 h-32 border-2 border-dashed border-[#D1D5DB] rounded-lg cursor-pointer hover:border-[#8B5CF6] transition-colors flex items-center justify-center"
                onClick={() => setShowImageModal(true)}
              >
                <div className="text-center">
                  <div className="w-8 h-8 bg-[#F3F4F6] rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-[#8B5CF6] text-lg">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pb-4">
            <Button variant="outline" className="border-[#F3F4F6] text-[#2D3748] bg-transparent">
              Save as Draft
            </Button>
            <Button className="bg-[#EF4444] hover:bg-[#DC2626] text-white" onClick={handleSchedulePost} disabled={isSubmitting}>
              {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
              Schedule Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchedulePostFormContent;
