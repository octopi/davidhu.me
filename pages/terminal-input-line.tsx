import React, { useEffect, useRef } from "react";

type TerminalInputLineProps = {
  canEdit: boolean;
  command: string;
  updateCommand: (command: string) => void;
  cycleCommand: (direction: number) => void;
  executeCommand: () => void;
  canAutocomplete: boolean;
  autocomplete: string;
  refocusTrigger: boolean; // hack to refocus the input line
};

const sanitize = (command: string) => {
  return command
    .replace(/\u200B/g, "") // zero-width space
    .replace(/\u00A0/g, " "); // non-breaking space
};

export default function TerminalInputLine({
  canEdit,
  command,
  updateCommand,
  executeCommand,
  cycleCommand,
  canAutocomplete,
  autocomplete,
  refocusTrigger,
}: TerminalInputLineProps) {
  const defaultCommand = useRef(command); // from https://stackoverflow.com/questions/45306325/react-contenteditable-and-cursor-position
  const inputLine = useRef<HTMLSpanElement>(null);

  // @ts-ignore
  const handleChange = (e: React.InputEvent<HTMLSpanElement>) => {
    let shouldExecute =
      e.nativeEvent.inputType === "insertParagraph" ||
      (e.currentTarget.innerText.length > 0 &&
        e.currentTarget.innerText.lastIndexOf("\n") + 1 ===
          e.currentTarget.innerText.length);
    if (shouldExecute) {
      executeCommand();
    } else {
      updateCommand(
        e.currentTarget.textContent ? sanitize(e.currentTarget.textContent) : ""
      );
    }
  };

  // @ts-ignore
  const handleKeyDown = (e: React.InputEvent<HTMLSpanElement>) => {
    // tab for autocomplete
    if (e.keyCode === 9 && canAutocomplete) {
      updateCommand(autocomplete);
      if (inputLine.current) inputLine.current.innerText = autocomplete;
      e.preventDefault();
      focusInputLine();
    }
    // up for previous command
    else if (e.keyCode === 38) {
      cycleCommand(-1);
      e.preventDefault();
    }
    // down for next command
    else if (e.keyCode === 40) {
      cycleCommand(1);
      e.preventDefault();
    }
  };

  const focusInputLine = () => {
    let il = inputLine.current;
    let textNode = il?.firstChild;
    if (il && textNode) {
      il.focus();
      let sel = window.getSelection()?.selectAllChildren(il);
      window.getSelection()?.collapseToEnd();
    }
  };

  useEffect(() => {
    focusInputLine();
  }, [refocusTrigger]);

  useEffect(() => {
    console.log("here")
    if (inputLine.current) inputLine.current.innerText = command;
    focusInputLine();
  }, [command]);

  const shouldShowAutocomplete =
    canAutocomplete &&
    autocomplete.substring(0, sanitize(command).length) === sanitize(command);

  return (
    <div
      className="px-2 pt-2 before:text-gray-500 before:content-['$']"
      onClick={focusInputLine}
    >
      <span
        contentEditable={canEdit}
        className="top-0 left-4 ml-2 border-0 bg-transparent text-sm font-bold text-gray-300 caret-blue-400 outline-none"
        onInput={handleChange}
        dangerouslySetInnerHTML={{ __html: defaultCommand.current }}
        onKeyDown={handleKeyDown}
        ref={inputLine}
      />
      {shouldShowAutocomplete && (
        <span className="font-mono text-sm italic text-gray-500">
          {autocomplete.substring(sanitize(command).length)}
        </span>
      )}
    </div>
  );
}
