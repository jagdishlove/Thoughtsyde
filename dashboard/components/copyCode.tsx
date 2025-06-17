"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export default function CodeBlock({ projectId, widgetUrl }) {
  const [copied, setCopied] = useState(false);

  const codeString = `<my-widget project="${projectId}"></my-widget>\n<script src="${widgetUrl}/widget.umd.js"></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative bg-gray-100 border border-gray-300 rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-800">
      <pre>
        <code>{codeString}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-200 flex items-center gap-1"
      >
        <Copy className="w-4 h-4" />
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
