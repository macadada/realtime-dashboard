"use client"

import React, { useEffect, useState, useCallback } from "react"
import useWebRTCAudioSession from "@/hooks/use-webrtc"
import { tools } from "@/lib/tools"
import { Hero } from "./components/Hero"
import { VoiceSelector } from "./components/VoiceSelector"
import { BroadcastButton } from "./components/BroadcastButton"
import { StatusDisplay } from "./components/StatusDisplay"
import { TokenUsageDisplay } from "./components/TokenUsageDisplay"
import { MessageControls } from "./components/MessageControls"
import { ToolsEducation } from "./components/ToolsEducation"
import { motion } from "framer-motion"
import { timeFunction, backgroundFunction, partyFunction, launchWebsite, takeScreenshot, copyToClipboard, generateMermaidMarkdown } from "./components/tools-functions"
import { Toaster } from "@/components/ui/sonner"
import OrbShowcase from "@/components/OrbShowcase"

const App: React.FC = () => {
  // State for voice selection
  const [voice, setVoice] = useState("ash")
  const [currentMermaidDiagram, setCurrentMermaidDiagram] = useState<string | undefined>(undefined);

  // WebRTC Audio Session Hook
  const {
    status,
    isSessionActive,
    registerFunction,
    handleStartStopClick,
    msgs,
    conversation,
    currentVolume,
    setIsSessionActive
  } = useWebRTCAudioSession(voice, tools)

  // Add keyboard shortcut handler
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.shiftKey && event.code === 'Space') {
      setIsSessionActive(prev => !prev);
      const testDiagram = `graph TD
        A[Start] --> B{Is it?}
        B -->|Yes| C[OK]
        B -->|No| D[End]`;
      console.log('Setting diagram:', testDiagram);
      setCurrentMermaidDiagram(testDiagram);
    }
  }, [setCurrentMermaidDiagram]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    // Register all functions
    registerFunction('getCurrentTime', timeFunction)
    registerFunction('changeBackgroundColor', backgroundFunction)
    registerFunction('partyMode', partyFunction)
    registerFunction('launchWebsite', launchWebsite)
    registerFunction('takeScreenshot', takeScreenshot)
    registerFunction('copyToClipboard', copyToClipboard)
    registerFunction('generateMermaidMarkdown', (input: { mermaidjs_markdown: string }) => {
      const result = generateMermaidMarkdown(input);
      if (result.success) {
        setCurrentMermaidDiagram(result.mermaidDiagram);
      }
      return result;
    })
  }, [registerFunction])

  return (
    <motion.main 
      className="flex-1 w-full"
      animate={{ 
        maxWidth: isSessionActive ? "100%" : "768px",
        margin: isSessionActive ? "0" : "0 auto"
      }}
      transition={{ 
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <div className="w-full px-5">
        <Hero />
        
        <div className={`w-full ${isSessionActive ? 'flex gap-6' : ''}`}>
          {/* Left column */}
          <motion.div 
            className={isSessionActive ? 'w-[400px] shrink-0' : 'w-full'}
            layout
            transition={{ 
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {isSessionActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <OrbShowcase 
                  status={status.includes('established') ? 'connected' : 'disconnected'}
                  conversation={conversation}
                  msgs={msgs}
                  currentVolume={currentVolume}
                />
              </motion.div>
            )}
            
            <VoiceSelector value={voice} onValueChange={setVoice} />
            
            <div className="flex flex-col items-center gap-4">
              <BroadcastButton 
                isSessionActive={isSessionActive} 
                onClick={handleStartStopClick}
              />
            </div>
          </motion.div>

          {/* Right column */}
          {isSessionActive && (
            <motion.div 
              className="flex-1 min-w-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {status && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <TokenUsageDisplay messages={msgs} />
                </motion.div>
              )}
              <motion.div 
                className="flex flex-col gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <MessageControls 
                  conversation={conversation} 
                  msgs={msgs}
                  mermaidDiagram={currentMermaidDiagram}
                />
              </motion.div>
              {status && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <StatusDisplay status={status} />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        <div className="w-full flex flex-col items-center gap-4 mt-6">
          <ToolsEducation />
        </div>
      </div>
      <Toaster />
    </motion.main>
  )
}

export default App;