import { Badge } from "@/components/ui/badge"
import { LayoutDashboard } from "lucide-react"

export function Hero() {
  return (
    <div className="text-center mb-8 rounded-lg p-4">
      <div className="flex justify-center items-center mx-auto gap-2 h-full w-full mb-2">
        <Badge className="text-xl font-medium flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5" />
          Mac&apos;s Dashboard
        </Badge>
      </div>
      <h1 className="text-4xl font-bold mb-4">
        Mac&apos;s Realtime Dashboard
      </h1>
      <p className="max-w-2xl mx-auto">
        Dashboard to test OpenAI WebRTC  API
      </p>
    </div>
  )
} 