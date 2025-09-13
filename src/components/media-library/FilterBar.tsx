import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export type MediaType = "all" | "image" | "video"

interface FilterBarProps {
  selectedType: MediaType
  onTypeChange: (type: MediaType) => void
  onClearFilters: () => void
  counter: number
  total: number
}

export function FilterBar({
  selectedType,
  onTypeChange,
  onClearFilters,
  counter,
  total,
}: FilterBarProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-4 py-6">

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

      {/* Stats */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {counter} of {total} files
          </span>
        </div>
      </div>
    </div>
  )
}