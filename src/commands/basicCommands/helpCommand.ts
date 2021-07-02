import { Command } from "../../interface";
import { Client, Message } from "discord.js";
import { embedBuilder } from "../../lib/Builder";
import { CacheProps } from "../../interface/cache";
import { cacheGet } from "../../lib/Cache";

export const command: Command = {
  name: "help",
  aliases: [""],
  label: "Help",
  description: "Showing the list of commands",
  run: async (client, message: Message, args: string[]) => {
    const commands = client.commands;
    const fieldsCommands = [];
    const Cache: CacheProps = await cacheGet(message.guild.id);
    commands.forEach((command) => {
      fieldsCommands.push({
        title: command.label,
        value: `${command.description}\nUsage: **${Cache.prefix.name}${command.name}**`,
        inline: true,
      });
    });

    await embedBuilder(
      message,
      "Commands List",
      "All the commands for me",
      client.user.username,
      null,
      fieldsCommands,
      null,
      client
    );
  },
};
