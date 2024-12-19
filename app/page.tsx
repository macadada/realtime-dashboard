"use client"

import React, { useEffect, useState } from "react";
import useWebRTCAudioSession from "@/hooks/use-webrtc"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge";
import confetti from 'canvas-confetti';
import { tools } from "@/lib/tools";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

const App: React.FC = () => {
  const [voice, setVoice] = useState("ash");

  const {
    status,
    isSessionActive,
    registerFunction,
    handleStartStopClick,
    msgs
  } = useWebRTCAudioSession(voice, tools);


  useEffect(() => {
    // Register all functions
    registerFunction('getCurrentTime', timeFunction);
    registerFunction('changeBackgroundColor', backgroundFunction); 
    registerFunction('partyMode', partyFunction);

    // Register the launchWebsite function
    registerFunction('launchWebsite', ({ url }: { url: string }) => {
      window.open(url, '_blank');
      return {
        success: true,
        message: `Launched website: ${url}`
      };
    });
  }, [registerFunction]);

  return (
    <main className="min-h-screen overflow-scroll bg-gradient-to-b from-gray-50 to-white flex items-center">
      <div className="bg-stone-100 border rounded-lg shadow-lg container flex flex-col items-center justify-center mx-auto max-w-3xl px-4 py-12 mb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mx-auto gap-2 h-full w-full mb-2">
            <Badge className="text-xl font-medium">
              shadcn/ui starter kit
            </Badge>
            <Link href="https://github.com/cameronking4/shadcn-openai-realtime-webrtc">
              <Button className="shadow-md rounded-full" variant="outline">
                <GithubIcon />
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            OpenAI WebRTC Audio Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience real-time voice AI powered by OpenAI&apos;s latest API (12/17/2024)<br/>
          </p>
        </div>

        {/* Main Controls Card */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="form-group space-y-2">
            <Label htmlFor="voiceSelect" className="text-sm font-medium">Select Voice</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ash">Ash - Gentle & Professional</SelectItem>
                <SelectItem value="ballad">Ballad - Warm & Engaging</SelectItem>
                <SelectItem value="coral">Coral - Clear & Friendly</SelectItem>
                <SelectItem value="sage">Sage - Authoritative & Calm</SelectItem>
                <SelectItem value="verse">Verse - Dynamic & Expressive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              variant={isSessionActive ? "destructive" : "default"}
              className="w-full py-6 text-lg font-medium flex items-center justify-center gap-2"
              onClick={handleStartStopClick}
            >
              {isSessionActive && (
                <Badge variant="secondary" className="animate-pulse bg-red-100 text-red-700">
                  Live
                </Badge>
              )}
              {isSessionActive ? "End Broadcasting Session" : "Start Broadcasting"}
            </Button>
          </div>
          
          {status && (
            <div className="w-full flex flex-col gap-2">

              {/* Status Display */}
              <div
                className={`rounded-lg p-4 text-center ${
                  status.startsWith("Error") 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`} 
              >
                {status}
              </div>
              {/* Token Usage Summary */} 
              <div className="space-y-4">
              {msgs.filter(msg => msg.type === 'response.done').slice(-1).map((msg, index) => (
                <div key={`usage-${index}`} className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Token Usage</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Total Tokens:</div>
                    <div>{msg.response.usage.total_tokens}</div>
                    <div>Input Tokens:</div>
                    <div>{msg.response.usage.input_tokens}</div>
                    <div>Output Tokens:</div>
                    <div>{msg.response.usage.output_tokens}</div>
                  </div>
                </div>
              ))}
              {/* Messages */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  msgs.forEach(msg => {
                    console.log(`Message Type: ${msg.type}`);
                    console.log(JSON.stringify(msg, null, 2));
                  });
                }}
              >
                Log Messages to Console
              </Button>
            </div>
          </div>
          )}

        </div>

        {/* Tools Education Section */}
        <div className="w-full mt-8 items-center text-center px-12">
          <h1 className="text-xl font-semibold mt-4">Example Tools</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {toolHints.map((tool, index) => (
              <div
                key={index}
                className="bg-background text-center p-4 border rounded-lg"
              >
                <h3 className="font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

const toolHints = [
  {
    title: "Get Current Time",
    description: "Gets the current time in your timezone",
  },
  {
    title: "Change Background Color",
    description: "Changes the background color of this page",
  },
  {
    title: "Party Mode",
    description: "Triggers a confetti animation on the page",
  },
  {
    title: "Launch Website",
    description: "Launches a website in a new tab",
  },
];

const timeFunction = () => {
  const now = new Date();
  return {
    success: true,
    time: now.toLocaleTimeString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
};

const backgroundFunction = ({ color }: { color: string }) => {
  try {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.classList.remove('bg-gradient-to-b', 'from-gray-50', 'to-white');
      mainElement.style.backgroundColor = color;
    }
    return { success: true, color, message: `Background color changed to ${color}` };
  } catch (error) {
    return { success: false, error: `Failed to change background color: ${error}` };
  }
};

const partyFunction = () => {
  try {
    const duration = 5 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
    const confettiConfig = {
      particleCount: 2,
      spread: 55,
      startVelocity: 60,
      colors
    };

    const shootConfetti = (angle: number, origin: { x: number, y: number }) => {
      confetti({
        ...confettiConfig,
        angle,
        origin
      });
    };

    const animate = () => {
      const now = Date.now();
      const end = now + duration;
      
      const frame = () => {
        if (Date.now() > end) return;
        shootConfetti(60, { x: 0, y: 0.5 });
        shootConfetti(120, { x: 1, y: 0.5 });
        requestAnimationFrame(frame);
      };

      // Change background colors during confetti
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.classList.remove('bg-gradient-to-b', 'from-gray-50', 'to-white');
        const originalBg = mainElement.style.backgroundColor;
        
        const changeColor = () => {
          const now = Date.now();
          const end = now + duration;
          
          const colorCycle = () => {
            if (Date.now() > end) {
              mainElement.style.backgroundColor = originalBg;
              return;
            }
            mainElement.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            setTimeout(colorCycle, 200);
          };
          
          colorCycle();
        };
        
        changeColor();
      }
      
      frame();
    };

    animate();
    return { success: true, message: "Confetti animation triggered successfully" };
  } catch (error) {
    return { success: false, error: `Failed to trigger confetti: ${error}` };
  }
};

export default App;