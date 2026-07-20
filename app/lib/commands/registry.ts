/**
 * Command Registry
 * 
 * SECURITY: All commands are statically defined function references.
 * User input is matched against this registry by string key.
 * NEVER construct and execute commands from user input dynamically.
 */

export type CommandHandler = () => unknown | Promise<unknown>;

export interface Command {
  id: string;
  label: string;
  category: string;
  keybinding?: string;
  handler: CommandHandler;
}

const commandRegistry = new Map<string, Command>();

export function registerCommand(command: Command): void {
  const validIdPattern = /^[a-zA-Z0-9:-]+$/;
  if (!validIdPattern.test(command.id)) {
    throw new Error(`Invalid command ID: ${command.id}`);
  }
  commandRegistry.set(command.id, command);
}

export function getCommand(id: string): Command | undefined {
  return commandRegistry.get(id);
}

export function getAllCommands(): Command[] {
  return Array.from(commandRegistry.values());
}

export function searchCommands(query: string): Command[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return getAllCommands();
  return getAllCommands().filter(cmd =>
    cmd.label.toLowerCase().includes(normalized) ||
    cmd.id.toLowerCase().includes(normalized) ||
    cmd.category.toLowerCase().includes(normalized)
  );
}
