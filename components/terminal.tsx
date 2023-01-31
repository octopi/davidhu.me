import { useEffect, useRef, useState } from "react";
import { scrollIntoView } from "seamless-scroll-polyfill";
import TerminalInputLine from "./terminal-input-line";
import JSONResponse from "./json-response";
import _ from "lodash";

type TerminalLine = InputLine | Result;

interface Result {
  id: number;
  type: "result" | "jsonresult";
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

// @ts-ignore
const API_URL_ROOT: string = process.env.NEXT_PUBLIC_VERCEL_URL
  ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL
  : "http://" + process.env.NEXT_PUBLIC_API_HOST;

// zero-width space to allow cursor to focus on empty lines
const FOCUS_HACK = "\u200B";

const AUTOCOMPLETE_LINES = [
  `curl ${API_URL_ROOT}/api/me`,
  `curl ${API_URL_ROOT}/api/me/bio`,
  `curl ${API_URL_ROOT}/api/me/experience`,
  `curl ${API_URL_ROOT}/api/me/contact`,
];

// get results for terminal comment
const fetchCommandResults = async (command: string) => {
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
    try {
      const response = await (
        await fetch(`${API_URL_ROOT}${urlParts[1]}`)
      ).json();
      return { message: JSON.stringify(response), error: false };
    } catch (e) {
      return {
        message:
          "Error calling the API! Check the route you typed or send me a message about this: me@davidhu.me.",
        error: true,
      };
    }
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
      autoComplete: AUTOCOMPLETE_LINES[0],
      canEdit: true,
    },
  ];
  const [lines, setLines] = useState<Array<TerminalLine>>(initialLines);
  const [refocusTrigger, setRefocusTrigger] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);

  const endCommandsRef = useRef<HTMLDivElement | null>(null);

  // copilot: react command that scrolls to the bottom of the terminal
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (endCommandsRef.current && lines.length > 1 && !isMobile)
      scrollIntoView(endCommandsRef.current, { behavior: "smooth" });
  }, [lines]);

  // copilot: handler that flips refocusTrigger based on click
  const handleRefocusTrigger = () => {
    setRefocusTrigger(!refocusTrigger);
  };

  const handleApiRouteClick = (route: string) => {
    const newLines = [...lines];
    (
      newLines[newLines.length - 1] as InputLine
    ).command = `curl ${API_URL_ROOT}/api${route}`;

    setLines(newLines);
    setTimeout(() => handleExecuteCommand(), 500);
  };

  const handleAutocompleteClick = () => {
    // copilot: set the latest command to the value of the autocomplete
    const newLines = [...lines];
    (newLines[newLines.length - 1] as InputLine).command = (
      newLines[newLines.length - 1] as InputLine
    ).autoComplete;

    setLines(newLines);
    setTimeout(() => handleExecuteCommand(), 500);
  };

  /**
   * Update state to reflect the current text of the command
   * @param command string the command
   */
  const handleUpdateCommand = (command: string) => {
    const newLines = [...lines];

    //copilot: find the index of AUTOCOMPLET_LINES that matches the start of the command
    const newAutocompleteIndex = AUTOCOMPLETE_LINES.findIndex((line) =>
      line.startsWith(command)
    );

    const newInputLine = _.merge(newLines[newLines.length - 1], {
      command,
      canAutoComplete: true,
      autoComplete: AUTOCOMPLETE_LINES[newAutocompleteIndex],
    });
    newLines[newLines.length - 1] = newInputLine;
    setLines(newLines);
    setCycleIndex(0);
  };

  const handleCycleCommand = (direction: number) => {
    let newCycleIndex = cycleIndex + direction;
    let prevCommandIndex = lines.length - 1 + newCycleIndex * 2;
    if (newCycleIndex > 0) return; // don't loop around
    if (lines.length - 1 + newCycleIndex * 2 < 0) return;

    const newLines = [...lines];

    if (newCycleIndex === 0) {
      (newLines[newLines.length - 1] as InputLine).command = "";
    } else {
      (newLines[newLines.length - 1] as InputLine).command = (
        lines[prevCommandIndex] as InputLine
      ).command;
    }

    setLines(newLines);
    setCycleIndex(newCycleIndex);
    setRefocusTrigger(!refocusTrigger);
  };

  const handleExecuteCommand = async () => {
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
    const result = await fetchCommandResults(input.command);
    newCommands.push({
      id: newCommands.length,
      type: result.error ? "result" : "jsonresult", // just assume all valid results are json
      result: result.message,
    });

    // add a new input line
    newCommands.push({
      id: newCommands.length,
      type: "input",
      command: FOCUS_HACK,
      canAutoComplete: result.error,
      autoComplete: AUTOCOMPLETE_LINES[1],
      canEdit: true,
    });

    setLines([...newCommands]);
  };

  return (
    <div
      className="rounded-lg shadow-2xl shadow-gray-900 md:w-[620px]"
      onClick={() => handleRefocusTrigger()}
    >
      <div className="relative h-9 rounded-t-lg bg-[rgba(45,45,45,1)] before:absolute before:left-1 before:m-3 before:h-3 before:w-3 before:rounded-full before:bg-[rgba(90,90,90,1)] before:shadow-[1.2em_0em_rgba(90,90,90,1),2.4em_0em_rgba(90,90,90,1)] before:content-['']"></div>
      <div className="relative h-96 overflow-scroll rounded-b-lg bg-[rgba(18,18,18,1)] pb-2 font-mono">
        {lines.map((line) => {
          if (line.type === "input") {
            return (
              <TerminalInputLine
                key={line.id}
                canEdit={line.id === lines.length - 1}
                command={line.command}
                onUpdateCommand={handleUpdateCommand}
                onExecuteCommand={handleExecuteCommand}
                onCycleCommand={handleCycleCommand}
                onAutocompleteClick={handleAutocompleteClick}
                canAutocomplete={line.canAutoComplete}
                autocomplete={line.autoComplete}
                refocusTrigger={refocusTrigger}
              />
            );
          } else {
            return line.type === "jsonresult" ? (
              <JSONResponse
                key={line.id}
                data={line.result}
                onApiRouteClick={handleApiRouteClick}
              />
            ) : (
              <div
                className="whitespace-pre-wrap break-words px-2 text-xs text-gray-500"
                key={line.id}
              >
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
