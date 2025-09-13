"use client"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, Hash, Facebook, Instagram, Linkedin } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { ImageSelectionModal } from "./image-selection-modal"
import SchedulePostFormContent from "./schedule-post-form-content" // Import the new component

const socialPlatforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "#E4405F",
    bgColor: "#8B5CF6",
    profile: "/placeholder.svg?height=24&width=24",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "#1877F2",
    bgColor: "#1877F2",
    profile: "/placeholder.svg?height=24&width=24",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    bgColor: "#0A66C2",
    profile: "/placeholder.svg?height=24&width=24",
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

interface SchedulePostPageProps {
  onClose: () => void
}

function SchedulePostPage({ onClose }: SchedulePostPageProps) {
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [tempSelectedImages, setTempSelectedImages] = useState<File[]>([])
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024) // Tailwind's 'lg' breakpoint
    }

    // Set initial value
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className={`flex flex-col lg:flex-row ${isLargeScreen ? "max-w-6xl rounded-lg" : "w-full h-full"} shadow-xl relative lg:gap-4 ${isLargeScreen ? "h-[calc(100vh-100px)]" : "h-full"} overflow-hidden`} onClick={(e) => e.stopPropagation()}>
        {/* Image Selection Modal - Conditionally rendered and wrapped based on screen size */}
        {showImageModal &&
          (isLargeScreen ? (
            // Desktop: Render directly as a flex item on the left
            <div className="w-full lg:w-1/2 h-full overflow-y-auto">
              <ImageSelectionModal
                onClose={() => setShowImageModal(false)}
                onConfirm={(images) => {
                  setSelectedImages((prev) => [...prev, ...images])
                  setTempSelectedImages([])
                  setShowImageModal(false)
                }}
                tempSelectedImages={tempSelectedImages}
                setTempSelectedImages={setTempSelectedImages}
              />
            </div>
          ) : (
            // Mobile: Render as a fixed overlay
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
              <ImageSelectionModal
                onClose={() => setShowImageModal(false)}
                onConfirm={(images) => {
                  setSelectedImages((prev) => [...prev, ...images])
                  setTempSelectedImages([])
                  setShowImageModal(false)
                }}
                tempSelectedImages={tempSelectedImages}
                setTempSelectedImages={setTempSelectedImages}
              />
            </div>
          ))}

        {/* Main Schedule Post Content */}
        <div className={`w-full ${isLargeScreen ? (showImageModal ? "lg:w-1/2" : "lg:w-[40rem] lg:mx-auto rounded-r-lg") : ""} h-full overflow-y-auto`}>
          <SchedulePostFormContent
            showImageModal={showImageModal}
            setShowImageModal={setShowImageModal}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            tempSelectedImages={tempSelectedImages}
            setTempSelectedImages={setTempSelectedImages}
            isLargeScreen={isLargeScreen}
            handleCloseSchedulePostPage={onClose}
          />
        </div>
      </div>
    </div>
  )
}

export default SchedulePostPage;
