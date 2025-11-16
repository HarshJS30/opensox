"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import gsap from "gsap"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const overlayRef = useRef<HTMLDivElement | null>(null)
  const blocksRef = useRef<HTMLDivElement[]>([])
  const transitioning = useRef(false)

  
  const createBlocks = () => {
    const overlay = overlayRef.current
    if (!overlay) return
    overlay.innerHTML = ""
    blocksRef.current = []

    for (let i = 0; i < 12; i++) {
      const div = document.createElement("div")
      div.style.flex = "1"
      div.style.background = "#1e1b4b"
      div.style.transform = "scaleX(0)"
      div.style.transformOrigin = "left"
      overlay.appendChild(div)
      blocksRef.current.push(div)
    }
  }

  
  const cover = (url: string) => {
    if (transitioning.current) return
    transitioning.current = true

    gsap.to(blocksRef.current, {
      scaleX: 1,
      duration: 0.4,
      stagger: 0.07,
      ease: "power2.inOut",
      onComplete: () => {
        router.push(url)
      }
    })
  }

  
  const reveal = () => {
    gsap.set(blocksRef.current, {
      scaleX: 1,
      transformOrigin: "right"
    })

    gsap.to(blocksRef.current, {
      scaleX: 0,
      duration: 0.4,
      stagger: 0.07,
      ease: "power2.inOut",
      onComplete: () => {
        transitioning.current = false
      }
    })
  }

  useEffect(() => {
    createBlocks()
    reveal()

    const links = document.querySelectorAll("a[href]")
    const handleClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement
      const href = target.getAttribute("href")
      
      // Don't hijack external links, new tabs, or modified clicks
      if (!href || href.startsWith("#")) {
        return
      }
      
      // Don't hijack external URLs
      if (href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) {
        return
      }
      
      // Don't hijack links that open in new tab or have external rel
      if (target.target === "_blank" || target.rel.includes("external")) {
        return
      }

      // Don't hijack modified clicks (cmd/ctrl click, middle click, etc.)
      const mouseEvent = e as MouseEvent
      if (mouseEvent.metaKey || mouseEvent.ctrlKey || mouseEvent.shiftKey || mouseEvent.button !== 0) {
        return
      }

      // Only hijack internal navigation
      if (href !== pathname) {
        e.preventDefault()
        cover(href)
      }
    }

    links.forEach((l) => l.addEventListener("click", handleClick))
    return () => links.forEach((l) => l.removeEventListener("click", handleClick))
  }, [pathname])

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />

      {children}
    </>
  )
}