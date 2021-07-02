import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import prisma from "../../prisma";
import { cacheGet, cacheSet } from "../../lib/Cache";

export const command: Command = {
  name: "setupserver",
  aliases: ["ss"],
  label: "Setup Server",
  run: async (client: Client, message: Message, args: string[]) => {
    if (args.length === 0) {
      return await message.reply(
        "No args provided! ( !ss or !setupserver ip:port )"
      );
    }

    const ip = args[0].split(":")[0];
    const port = args[0].split(":")[1];

    if (ip && port) {
      await prisma.guild.update({
        where: {
          guildID: message.guild.id,
        },
        data: {
          serverIP: `${ip}:${port}`,
        },
      });

      const currentCache = await cacheGet(message.guild.id);
      await cacheSet(message.guild.id, {
        ...currentCache,
        serverIP: {
          ip: `${ip}:${port}`,
        },
      });

      return await message.reply(`${ip}:${port} saved successfully!`);
    } else {
      return await message.reply(
        `There was an issue with your serverip. <Arguments: ip:port>`
      );
    }
  },
};
