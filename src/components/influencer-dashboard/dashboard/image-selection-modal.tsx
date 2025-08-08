"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Plus, Check, Upload, HardDrive, Cloud } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample images to demonstrate existing uploads
const sampleImages = [
  "/image-placeholder.png?id=1",
  "/image-placeholder.png?id=2",
  "/image-placeholder.png?id=3",
  "/image-placeholder.png?id=4",
  "/image-placeholder.png?id=5",
  "/image-placeholder.png?id=6",
]

interface ImageSelectionModalProps {
  onClose: () => void
  onConfirm: (images: File[]) => void
  tempSelectedImages: File[]
  setTempSelectedImages: React.Dispatch<React.SetStateAction<File[]>>
}

export function ImageSelectionModal({
  onClose,
  onConfirm,
  tempSelectedImages,
  setTempSelectedImages,
}: ImageSelectionModalProps) {
  const [selectedSampleImages, setSelectedSampleImages] = useState<string[]>([])

  const handleSampleImageToggle = (imageUrl: string) => {
    setSelectedSampleImages((prev) =>
      prev.includes(imageUrl) ? prev.filter((url) => url !== imageUrl) : [...prev, imageUrl],
    )
  }

  const handleConfirm = () => {
    // Convert selected sample images to File objects (mock for demo)
    const sampleFiles = selectedSampleImages.map((url, index) => {
      // Create a mock file for demo purposes
      const mockFile = new File([""], `sample-${index}.jpg`, { type: "image/jpeg" })
      return mockFile
    })

    onConfirm([...tempSelectedImages, ...sampleFiles])
    setSelectedSampleImages([])
  }

  const handleCancel = () => {
    setTempSelectedImages([])
    setSelectedSampleImages([])
    onClose()
  }

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-xl",
        "flex flex-col",
        "w-full h-full", // Now takes full width/height of its parent container
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#F3F4F6]">
        <h3 className="text-lg font-semibold text-[#2D3748] font-['Roboto_Slab']">Select Images</h3>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" onClick={handleCancel} className="hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleConfirm} className="hover:bg-gray-100">
            <Check className="w-4 h-4 text-green-500" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Upload Options */}
        <div className="p-4 border-b border-[#F3F4F6]">
          <div className="flex flex-row gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                setTempSelectedImages((prev) => [...prev, ...files])
              }}
              className="hidden"
              id="multiple-image-upload"
            />
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => document.getElementById('multiple-image-upload')?.click()}>
              <label
                htmlFor="multiple-image-upload"
                className="flex items-center justify-center bg-white border border-[#F3F4F6] text-[#2D3748] rounded-full group-hover:bg-gray-100 transition-colors p-2 text-center"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                  <Plus className="w-full h-full" />
                </div>
              </label>
              <span className="text-xs text-[#2D3748] mt-2">From Device</span>
            </div>

            <div className="flex flex-col items-center group cursor-pointer" onClick={() => { }}>
              <Button
                variant="outline"
                className="flex items-center justify-center w-h-14 h-14 border-[#F3F4F6] text-[#2D3748] bg-transparent rounded-full p-3 text-center overflow-hidden group-hover:bg-gray-100 transition-colors"
              >
                <img src="/integrated apps/google-drive-logo.png" alt="Google Drive" className="w-9 h-full object-cover" />
              </Button>
              <span className="text-xs text-[#2D3748] mt-2">Google Drive</span>
            </div>

            <div className="flex flex-col items-center group cursor-pointer" onClick={() => { }}>
              <Button
                variant="outline"
                className="flex items-center justify-center w-h-14 h-14 border-[#F3F4F6] text-[#2D3748] bg-transparent rounded-full p-3 text-center overflow-hidden group-hover:bg-gray-100 transition-colors"
              >
                <img src="/integrated apps/dropbox-logo.png" alt="Dropbox" className="w-full h-full object-cover" />
              </Button>
              <span className="text-xs text-[#2D3748] mt-2">Dropbox</span>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        <div className="p-4">
          {/* Recently Uploaded Section */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-[#2D3748] mb-3">Recently Uploaded</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {sampleImages.map((imageUrl, index) => {
                const isSelected = selectedSampleImages.includes(imageUrl)
                return (
                  <div key={index} className="relative cursor-pointer" onClick={() => handleSampleImageToggle(imageUrl)}>
                    <img
                      src={imageUrl || "/image-placeholder.png"}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg transition-all"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-[#8B5CF6] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Newly Selected Section */}
          {tempSelectedImages.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-[#2D3748] mb-3">Newly Selected</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {tempSelectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image) || "/image-placeholder.png"}
                      alt={`Selected ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border-2 border-[#8B5CF6]"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full"
                      onClick={() => setTempSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
