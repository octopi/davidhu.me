import { useState } from "react";
import TerminalInputLine from "./terminal-input-line";
import _ from "lodash";

type Command = {
  id: number;
  command: string;
  canAutoComplete: boolean;
  autoComplete: string;
  canEdit: boolean;
};

export default function Terminal() {
  const initialCommands: Array<Command> = [
    {
      id: 0,
      command: "c",
      canAutoComplete: true,
      autoComplete: "curl thething.com",
      canEdit: true,
    },
  ];
  const [commands, setCommands] = useState<Array<Command>>(initialCommands);

  const updateCommand = (command: string) => {
    const newCommands = [...commands];
    newCommands[newCommands.length - 1].command = command;
    setCommands(newCommands);
  };

  const executeCommand = () => {
    console.log("executing! command is", _.last(commands)?.command);
    const newCommands = [...commands];
    newCommands[newCommands.length - 1].canAutoComplete = false;
    newCommands[newCommands.length - 1].autoComplete = "";
    newCommands[newCommands.length - 1].canEdit = false;
    newCommands.push({
      id: newCommands.length,
      command: " ",
      canAutoComplete: false,
      autoComplete: "",
      canEdit: true,
    });
    console.log(newCommands);
    setCommands([...newCommands]);
  };

  return (
    <div className="w-2/3 min-w-[400px] max-w-2xl rounded-lg shadow-2xl shadow-gray-900">
      <div className="relative h-9 rounded-t-lg bg-[rgba(27,27,34,1)] before:absolute before:left-1 before:m-3 before:h-3 before:w-3 before:rounded-full before:bg-[rgba(60,60,60,1)] before:shadow-[1.2em_0em_rgba(60,60,60,1),2.4em_0em_rgba(60,60,60,1)] before:content-['']"></div>
      <div className="relative h-96 rounded-b-lg bg-[rgba(18,18,18,1)] font-mono">
        {commands.map((command) => (
          <TerminalInputLine
            key={command.id}
            canEdit={command.id === commands.length - 1}
            command={command.command}
            updateCommand={updateCommand}
            executeCommand={executeCommand}
            canAutocomplete={command.canAutoComplete}
            autocomplete={command.autoComplete}
          />
        ))}
      </div>
    </div>
  );
}
