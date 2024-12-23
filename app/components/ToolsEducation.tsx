import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

const AVAILABLE_TOOLS = [
  {
    name: "Copy to Clipboard",
    description: 'Say "Copy to clipboard [text]" to copy text to the clipboard.',
  },
  {
    name: "Get Time",
    description: 'Ask "What time is it?" to get the current time.',
  },
  {
    name: "Background Color",
    description: 'Say "Change background to [color]" to change the page background.',
  },
  {
    name: "Party Mode",
    description: 'Say "Start party mode" for a fun color animation!',
  },
  {
    name: "Launch Website",
    description: 'Say "Open website [URL]" to launch a website in a new tab.',
  },
] as const;

export function ToolsEducation() {
  return (
    <div className="w-full max-w-lg mt-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="tools">
          <AccordionTrigger>Available Tools</AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableBody>
                {AVAILABLE_TOOLS.map((tool) => (
                  <TableRow key={tool.name}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {tool.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
} 