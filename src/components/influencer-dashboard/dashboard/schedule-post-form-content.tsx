"use client"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, Hash, Facebook, Instagram, Linkedin, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { ImageSelectionModal } from "./image-selection-modal"

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
  tempSelectedImages: File[];
  setTempSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  isLargeScreen: boolean;
  handleCloseSchedulePostPage: () => void;
}

function SchedulePostFormContent({
  showImageModal,
  setShowImageModal,
  selectedImages,
  setSelectedImages,
  tempSelectedImages,
  setTempSelectedImages,
  isLargeScreen,
  handleCloseSchedulePostPage,
}: SchedulePostFormContentProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("12:00")
  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")

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
                className="min-h-[120px] border-[#F3F4F6] focus:border-[#EF4444] text-[#2D3748] resize-none pb-12 rounded-t-md"
              />

              <div
                className="w-full bg-white border-l border-r border-b border-[#F3F4F6] rounded-b-md px-3 py-2 cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                onClick={() => { }}
              >
                <div className="flex items-center text-[#8B5CF6] text-sm">
                  <Hash className="w-4 h-4 mr-2" />
                  <span>hashtag suggestions</span>
                </div>
              </div>
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
            <Button className="bg-[#EF4444] hover:bg-[#DC2626] text-white">Schedule Post</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchedulePostFormContent;
