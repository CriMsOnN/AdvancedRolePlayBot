import { Event, Command } from "../interface";
import { Message } from "discord.js";

export const event: Event = {
  name: "message",
  run: async (client, message: Message) => {
    let args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);

    const cmd = args.shift()!.toLocaleLowerCase();
    if (!cmd) return;

    const command = client.commands.get(cmd) || client.aliases.get(cmd);
    if (command) {
      (command as Command).run(client, message, args);
    }
  },
};
