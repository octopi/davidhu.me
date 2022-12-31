import React, { useEffect, useRef} from "react";

type TerminalInputLineProps = {
  command: string;
  updateCommand: (command: string) => void;
  executeCommand: () => void;
  canAutocomplete: boolean;
  autocomplete: string;
};

export default function TerminalInputLine({
  command,
  updateCommand,
  executeCommand,
  canAutocomplete,
  autocomplete,
}: TerminalInputLineProps) {
  const defaultCommand = useRef(command);
  const inputLine = useRef<HTMLSpanElement>(null);

  // @ts-ignore
  const handleChange = (e: React.InputEvent<HTMLSpanElement>) => {
    if (e.nativeEvent.inputType === "insertParagraph") {
      executeCommand();
    } else {
      updateCommand(
        e.currentTarget.textContent
          ? e.currentTarget.textContent.replace(/\u00A0/g, " ")
          : ""
      );
    }
  };

  const focusInputLine = () => {
    let il = inputLine.current;
    let textNode = il?.firstChild;
    if (il && textNode) {
      il.focus();
      let range = document.createRange();
      range.setStart(textNode, textNode?.nodeValue?.length || 0);
      range.setEnd(textNode, textNode?.nodeValue?.length || 0);
      let sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const shouldShowAutocomplete =
    canAutocomplete && autocomplete.substring(0, command.length) === command;

  return (
    <div
      className="absolute m-2 before:text-gray-500 before:content-['$']"
      onClick={focusInputLine}
    >
      <span
        contentEditable
        className="top-0 left-4 ml-2 h-10 border-0 bg-transparent text-sm font-bold text-gray-300 caret-blue-400 outline-none"
        onInput={handleChange}
        dangerouslySetInnerHTML={{ __html: defaultCommand.current }}
        ref={inputLine}
      />
      {shouldShowAutocomplete && (
        <span className="font-mono text-sm italic text-gray-500">
          {autocomplete.substring(command.length)}
        </span>
      )}
    </div>
  );
}
