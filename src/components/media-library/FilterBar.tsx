import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export type MediaType = "all" | "image" | "video"

interface FilterBarProps {
  selectedType: MediaType
  onTypeChange: (type: MediaType) => void
  onClearFilters: () => void
}

export function FilterBar({
  selectedType,
  onTypeChange,
  onClearFilters
}: FilterBarProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-4 pt-6 pb-[0.5rem]">

      {/* Media Type Filter - Inline Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={selectedType === "all" ? "default" : "outline"}
          onClick={() => onTypeChange("all")}
        >
          All Media
        </Button>
        <Button
          variant={selectedType === "image" ? "default" : "outline"}
          onClick={() => onTypeChange("image")}
        >
          Images
        </Button>
        <Button
          variant={selectedType === "video" ? "default" : "outline"}
          onClick={() => onTypeChange("video")}
        >
          Videos
        </Button>
      </div>
    </div>
  )
}