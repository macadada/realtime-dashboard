"use client"

import { toast } from "sonner"
import confetti from 'canvas-confetti'
import { animate as framerAnimate } from "framer-motion"

export const timeFunction = () => {
  const now = new Date()
  return {
    success: true,
    time: now.toLocaleTimeString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    message: "Announce to user: The current time is " + now.toLocaleTimeString() + " in " + Intl.DateTimeFormat().resolvedOptions().timeZone + " timezone."
  }
}

export const backgroundFunction = ({ color }: { color: string }) => {
  const currentColor = document.body.style.backgroundColor;
  try {
    const mainElement = document.querySelector('main')
    if (mainElement) {
      mainElement.classList.remove('bg-gradient-to-b', 'from-gray-50', 'to-white')
      mainElement.style.backgroundColor = color
    }
    toast("Background color changed! 🎉", {
        description: `Background color changed to ${color}`,
        action: {
          label: "Undo",
          onClick: () => {
            if (mainElement) {
              mainElement.style.backgroundColor = currentColor
            }
          },
        },
      })
    return { success: true, color, message: `Background color changed to ${color}` }
  } catch (error) {
    return { success: false, message: `Failed to change background color: ${error}` }
  }
}

export const partyFunction = () => {
  try {
    const duration = 5 * 1000
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1", "#3b82f6", "#14b8a6", "#f97316", "#10b981", "#facc15"]
    
    const confettiConfig = {
      particleCount: 30,
      spread: 100,
      startVelocity: 90,
      colors,
      gravity: 0.5
    }

    const shootConfetti = (angle: number, origin: { x: number, y: number }) => {
      confetti({
        ...confettiConfig,
        angle,
        origin
      })
    }

    const animate = () => {
      const now = Date.now()
      const end = now + duration
      
      const elements = document.querySelectorAll('div, p, button, h1, h2, h3')
      elements.forEach((element) => {
        framerAnimate(element, 
          { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }, 
          { 
            duration: 0.5,
            repeat: 10,
            ease: "easeInOut"
          }
        )
      })

      const frame = () => {
        if (Date.now() > end) return
        shootConfetti(60, { x: 0, y: 0.5 })
        shootConfetti(120, { x: 1, y: 0.5 })
        requestAnimationFrame(frame)
      }

      const mainElement = document.querySelector('main')
      if (mainElement) {
        mainElement.classList.remove('bg-gradient-to-b', 'from-gray-50', 'to-white')
        const originalBg = mainElement.style.backgroundColor
        
        const changeColor = () => {
          const now = Date.now()
          const end = now + duration
          
          const colorCycle = () => {
            if (Date.now() > end) {
              framerAnimate(mainElement, 
                { backgroundColor: originalBg },
                { duration: 0.5 }
              )
              return
            }
            const newColor = colors[Math.floor(Math.random() * colors.length)]
            framerAnimate(mainElement,
              { backgroundColor: newColor },
              { duration: 0.2 }
            )
            setTimeout(colorCycle, 200)
          }
          
          colorCycle()
        }
        
        changeColor()
      }
      
      frame()
    }

    animate()
    toast("Party mode activated! 🎉", {
        description: "Party mode activated! 🎉",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      })
    return { success: true, message: "Party mode activated! 🎉" }
  } catch (error) {
    return { success: false, message: `Failed to trigger party mode: ${error}` }
  }
}

export const launchWebsite = ({ url }: { url: string }) => {
  window.open(url, '_blank')
  return {
    success: true,
    message: `Launched the site${url}, tell the user it's been launched.`
  }
}

export const takeScreenshot = () => {
  const screenshot = document.querySelector('main')
  
  return {
    success: true,
    screenshot,
    message: "Screenshot taken. Ask the user to paste it somewhere."
  }
}

export const copyToClipboard = ({ text }: { text: string }) => {
  navigator.clipboard.writeText(text)
  return {
    success: true,
    text,
    message: "Text copied to clipboard. Ask the user to paste it somewhere."
  }
}