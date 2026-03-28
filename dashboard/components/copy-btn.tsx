"use client";
import { useState } from "react";
import { Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const CopyBtn = ({ text, className }: {
  text: string
  className?: string
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={() => copyToClipboard(text)} 
            variant="ghost" 
            size="sm"
            className={`text-slate-300 hover:text-white hover:bg-slate-800 ${className}`}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Clipboard className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? 'Copied!' : 'Copy code'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CopyBtn;