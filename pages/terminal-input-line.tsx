import React, { useEffect, useRef } from "react";

type TerminalInputLineProps = {
  canEdit: boolean;
  command: string;
  updateCommand: (command: string) => void;
  executeCommand: () => void;
  canAutocomplete: boolean;
  autocomplete: string;
};

const sanitize = (command: string) => {
  return command.replace(/\u200B/g, "").replace(/\u00A0/g, " ");
};

export default function TerminalInputLine({
  canEdit,
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
    let shouldExecute =
      e.nativeEvent.inputType === "insertParagraph" ||
      (e.currentTarget.innerText.length > 0 &&
        e.currentTarget.innerText.lastIndexOf("\n") + 1 ===
          e.currentTarget.innerText.length);
    if (shouldExecute) {
      executeCommand();
    } else {
      updateCommand(
        e.currentTarget.textContent
          ? sanitize(e.currentTarget.textContent)
          : ""
      );
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
  }, []);

  const shouldShowAutocomplete =
    canAutocomplete && autocomplete.substring(0, sanitize(command).length) === sanitize(command);

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
