import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface TopNavProps {
  items: Array<{ key: string; label: string }>
  activeKey: string
  onSelect: (key: string) => void
}

const TopNav: React.FC<TopNavProps> = ({ items, activeKey, onSelect }) => {
  const navRef = useRef<HTMLDivElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (activeButtonRef.current && navRef.current) {
      const button = activeButtonRef.current
      const nav = navRef.current
      
      // Get button position relative to nav container
      const buttonLeft = button.offsetLeft
      const buttonWidth = button.offsetWidth
      const navScrollLeft = nav.scrollLeft
      const navWidth = nav.offsetWidth
      
      // Calculate visible area
      const buttonRight = buttonLeft + buttonWidth
      const visibleLeft = navScrollLeft
      const visibleRight = navScrollLeft + navWidth
      
      // Calculate 10% of button width for sensitivity
      const threshold = buttonWidth * 0.1
      
      // Auto-scroll if more than 10% of button is cut off
      if (buttonLeft < visibleLeft - threshold) {
        // More than 10% cut off on the left
        nav.scrollTo({
          left: buttonLeft - 16, // Add some padding from left edge
          behavior: 'smooth'
        })
      } else if (buttonRight > visibleRight + threshold) {
        // More than 10% cut off on the right
        nav.scrollTo({
          left: buttonRight - navWidth + 16, // Position with padding from right edge
          behavior: 'smooth'
        })
      }
    }
  }, [activeKey])

  return (
    <nav
      ref={navRef}
      className="flex max-w-screen overflow-x-auto border-b border-gray-200 lg:hidden sticky top-[4rem] bg-white/80 backdrop-blur-sm z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {items.map((item) => (
        <button
          key={item.key}
          ref={activeKey === item.key ? activeButtonRef : null}
          className={cn(
            'flex-shrink-0 px-4 py-3 text-sm font-medium',
            activeKey === item.key
              ? "text-primary border-b-2 border-primary"
              : "text-[#2D3748] hover:text-black",
          )}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

export default TopNav