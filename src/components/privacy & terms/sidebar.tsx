import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  name: string
  items: Array<{ key: string; label: string }>
  activeKey: string
  onSelect: (key: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ name, items, activeKey, onSelect }) => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (activeButtonRef.current && sidebarRef.current) {
      const button = activeButtonRef.current
      const sidebar = sidebarRef.current
      
      // Get button position relative to sidebar container
      const buttonTop = button.offsetTop
      const buttonHeight = button.offsetHeight
      const sidebarScrollTop = sidebar.scrollTop
      const sidebarHeight = sidebar.clientHeight
      
      // Calculate visible area
      const buttonBottom = buttonTop + buttonHeight
      const visibleTop = sidebarScrollTop
      const visibleBottom = sidebarScrollTop + sidebarHeight
      
      // Calculate 10% of button height for sensitivity
      const threshold = buttonHeight * 0.1
      
      // Auto-scroll if more than 10% of button is cut off
      if (buttonTop < visibleTop + threshold) {
        // More than 10% cut off at the top
        sidebar.scrollTo({
          top: buttonTop - 16, // Add some padding from top
          behavior: 'smooth'
        })
      } else if (buttonBottom > visibleBottom - threshold) {
        // More than 10% cut off at the bottom
        sidebar.scrollTo({
          top: buttonBottom - sidebarHeight + 16, // Position with padding from bottom
          behavior: 'smooth'
        })
      }
    }
  }, [activeKey])

  return (
    <aside 
      ref={sidebarRef}
      className="w-64 border-r border-gray-200 max-h-[calc(100vh-4rem)] py-4 px-4 flex-col hidden lg:flex sticky top-[4rem] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-height:none]"
    >
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.key} className="list-none">
            <button
              ref={activeKey === item.key ? activeButtonRef : null}
              className={cn(
                'w-full text-left px-3 py-2 rounded-md transition-colors font-medium flex items-center gap-2',
                activeKey === item.key ? "text-primary" : "text-[#2D3748] hover:text-black",
              )}
              onClick={() => onSelect(item.key)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar