import { useEffect, useRef, useState } from "react";
import { scrollIntoView } from "seamless-scroll-polyfill";
import TerminalInputLine from "./terminal-input-line";
import _ from "lodash";

type TerminalLine = InputLine | Result;

interface Result {
  id: number;
  type: "result";
  result: string;
}

interface InputLine {
  id: number;
  type: "input";
  command: string;
  canAutoComplete: boolean;
  autoComplete: string;
  canEdit: boolean;
}

// zero-width space to allow cursor to focus on empty lines
const FOCUS_HACK = "\u200B";

export default function Terminal() {
  const initialLines: Array<TerminalLine> = [
    {
      id: 0,
      type: "input",
      command: `${FOCUS_HACK}c`,
      canAutoComplete: true,
      autoComplete: "curl thething.com",
      canEdit: true,
    },
  ];
  const [lines, setLines] = useState<Array<TerminalLine>>(initialLines);
  const endCommandsRef = useRef<HTMLDivElement | null>(null);

  // react command that scrolls to the bottom of the terminal
  useEffect(() => {
    if (endCommandsRef.current)
      scrollIntoView(endCommandsRef.current, { behavior: "smooth" });
  }, [lines]);

  const updateCommand = (command: string) => {
    const newLines = [...lines];
    (newLines[newLines.length - 1] as InputLine).command = command;
    setLines(newLines);
  };

  const executeCommand = () => {
    const input = _.last(lines) as InputLine;

    // freeze the current input line
    _.merge(input, {
      canAutoComplete: false,
      autoComplete: "",
      canEdit: false,
    });

    const newCommands: Array<TerminalLine> = [...lines];
    newCommands[newCommands.length - 1] = input;

    // get result line
    newCommands.push({
      id: newCommands.length,
      type: "result",
      result: "you said: " + input.command,
    });

    // add a new input line
    newCommands.push({
      id: newCommands.length,
      type: "input",
      command: FOCUS_HACK,
      canAutoComplete: false,
      autoComplete: "",
      canEdit: true,
    });
    console.log(newCommands);
    setLines([...newCommands]);
  };

  return (
    <div className="w-2/3 min-w-[400px] max-w-2xl rounded-lg shadow-2xl shadow-gray-900">
      <div className="relative h-9 rounded-t-lg bg-[rgba(27,27,34,1)] before:absolute before:left-1 before:m-3 before:h-3 before:w-3 before:rounded-full before:bg-[rgba(60,60,60,1)] before:shadow-[1.2em_0em_rgba(60,60,60,1),2.4em_0em_rgba(60,60,60,1)] before:content-['']"></div>
      <div className="relative h-96 overflow-scroll rounded-b-lg bg-[rgba(18,18,18,1)] pb-2 font-mono">
        {lines.map((line) => {
          if (line.type === "input") {
            return (
              <TerminalInputLine
                key={line.id}
                canEdit={line.id === lines.length - 1}
                command={line.command}
                updateCommand={updateCommand}
                executeCommand={executeCommand}
                canAutocomplete={line.canAutoComplete}
                autocomplete={line.autoComplete}
              />
            );
          } else {
            return (
              <div className="text-gray-700 px-2" key={line.id}>{line.result}</div>
            );
          }
        })}
        <div ref={endCommandsRef} />
      </div>
    </div>
  );
}
