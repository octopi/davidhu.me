import React, { useRef } from "react";

type TerminalInputLineProps = {
  command: string;
  updateCommand: (command: string) => void;
};

export default function TerminalInputLine({
  command,
  updateCommand,
}: TerminalInputLineProps) {
  const defaultCommand = useRef(command);

  const handleChange = (e: React.ChangeEvent<HTMLSpanElement>) => {
    updateCommand(e.currentTarget.textContent || "");
  };

  return (
    <div className="absolute m-2 before:text-gray-500 before:content-['$']">
      <span
        contentEditable
        className="top-0 left-4 ml-2 h-10 border-0 bg-transparent text-sm font-bold text-gray-300 caret-blue-400 outline-none"
        onInput={handleChange}
        dangerouslySetInnerHTML={{ __html: defaultCommand.current }}
      />
      <span className="font-mono text-sm italic text-gray-500">
        url thething.com
      </span>
    </div>
  );
}
