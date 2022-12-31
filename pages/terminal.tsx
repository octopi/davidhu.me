import { useState } from "react";
import TerminalInputLine from "./terminal-input-line";

export default function Terminal() {
  const [command, setCommand] = useState<string>("c");
  return (
    <div className="w-2/3 min-w-[400px] max-w-2xl rounded-lg shadow-2xl shadow-gray-900">
      <div className="relative h-9 rounded-t-lg bg-[rgba(27,27,34,1)] before:absolute before:left-1 before:m-3 before:h-3 before:w-3 before:rounded-full before:bg-[rgba(60,60,60,1)] before:shadow-[1.2em_0em_rgba(60,60,60,1),2.4em_0em_rgba(60,60,60,1)] before:content-['']"></div>
      <div className="relative h-96 rounded-b-lg bg-[rgba(18,18,18,1)] font-mono">
        <TerminalInputLine command={command} updateCommand={setCommand} canAutocomplete={true} autocomplete="curl thething.com" />
      </div>
    </div>
  );
}
