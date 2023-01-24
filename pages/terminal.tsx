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

const API_URL_ROOT = "http://localhost:3000";

// zero-width space to allow cursor to focus on empty lines
const FOCUS_HACK = "\u200B";

// get results for terminal comment
const getCommandResults = async (command: string) => {
  const commandParts = command.split(" ");
  const commandName = commandParts[0];
  const commandArgs = commandParts.slice(1);

  if (commandName !== "curl") {
    return { message: `command not found: ${commandName}`, error: true };
  } else if (commandArgs.length !== 1) {
    return {
      message: `invalid arguments: ${commandArgs.join(" ")}`,
      error: true,
    };
  }

  const urlParts = commandArgs[0].split(API_URL_ROOT);
  // check if the URL is safe (this domain only)
  if (urlParts.length === 2 && urlParts[0] === "") {
    const response = await (
      await fetch(`${API_URL_ROOT}${urlParts[1]}`)
    ).json();
    return { message: JSON.stringify(response), error: false };
  } else {
    return {
      message: `Sorry, I can only fetch from ${API_URL_ROOT}`,
      error: true,
    };
  }
};

export default function Terminal() {
  const initialLines: Array<TerminalLine> = [
    {
      id: 0,
      type: "input",
      command: `${FOCUS_HACK}c`,
      canAutoComplete: true,
      autoComplete: `curl ${API_URL_ROOT}/api/me`,
      canEdit: true,
    },
  ];
  const [lines, setLines] = useState<Array<TerminalLine>>(initialLines);
  const [refocusTrigger, setRefocusTrigger] = useState(false);

  const endCommandsRef = useRef<HTMLDivElement | null>(null);
  const boo = useRef<HTMLDivElement | null>(null);

  // copilot: react command that scrolls to the bottom of the terminal
  useEffect(() => {
    if (endCommandsRef.current)
      scrollIntoView(endCommandsRef.current, { behavior: "smooth" });
  }, [lines]);

  // copilot: handler that flips refocusTrigger based on click
  const handleRefocusTrigger = () => {
    setRefocusTrigger(!refocusTrigger);
  };

  const updateCommand = (command: string) => {
    const newLines = [...lines];
    (newLines[newLines.length - 1] as InputLine).command = command;
    setLines(newLines);
  };

  const executeCommand = async () => {
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
    const result = await getCommandResults(input.command);
    newCommands.push({
      id: newCommands.length,
      type: "result",
      result: result.message,
    });

    // add a new input line
    newCommands.push({
      id: newCommands.length,
      type: "input",
      command: FOCUS_HACK,
      canAutoComplete: result.error,
      autoComplete: result.error ? `curl ${API_URL_ROOT}/api/me` : '',
      canEdit: true,
    });
    console.log(newCommands);
    setLines([...newCommands]);
  };

  return (
    <div
      className="w-2/3 min-w-[400px] max-w-2xl rounded-lg shadow-2xl shadow-gray-900"
      onClick={() => handleRefocusTrigger()}
    >
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
                refocusTrigger={refocusTrigger}
              />
            );
          } else {
            return (
              <div className="px-2 text-gray-700" key={line.id}>
                {line.result}
              </div>
            );
          }
        })}
        <div ref={endCommandsRef} />
      </div>
    </div>
  );
}
