import Client from "../client";
import { Message, PermissionResolvable } from "discord.js";

interface Run {
  (client: Client, message: Message, args: string[]);
}

export interface Command {
  name: string;
  description?: string;
  permissions?: PermissionResolvable[];
  aliases?: string[];
  label: string;
  run: Run;
}
