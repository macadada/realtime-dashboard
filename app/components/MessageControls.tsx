import Mermaid from "@/components/ui/mermaid"
import { Button } from "@/components/ui/button"
import Transcriber from "@/components/ui/transcriber"
import { Conversation } from "@/lib/conversations"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Message as MessageType } from "@/types"

export function MessageControls({ 
  conversation, 
  msgs, 
  mermaidDiagram 
}: { 
  conversation: Conversation[], 
  msgs: MessageType[],
  mermaidDiagram?: string
}) {
  console.log('MessageControls render check:', { 
    conversationLength: conversation.length,
    hasMermaid: !!mermaidDiagram
  });
  
  return (
    <div className="space-y-2">
      {/* Conversation section only renders if there's a conversation */}
      {conversation.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Conversation History</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View Logs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Conversation Logs</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Content</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {msgs.map((msg, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{msg.type}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {JSON.stringify(msg, null, 2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Transcriber conversation={conversation.slice(-1)} />
        </>
      )}

      {/* Mermaid section renders independently of conversation */}
      {mermaidDiagram && (
        <div className="mt-4 p-4 bg-muted rounded-lg border border-blue-500/50">
          <div className="mb-2 text-sm text-muted-foreground">Diagram:</div>
          <Mermaid chart={mermaidDiagram} />
        </div>
      )}
    </div>
  )
} 