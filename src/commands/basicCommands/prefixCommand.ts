import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import prisma from "../../prisma";
import { cacheGet, cacheSet } from "../../lib/Cache";
import { CacheProps } from "../../interface/cache";

export const command: Command = {
  name: "prefix",
  aliases: ["p"],
  label: "Change prefix",
  description: "Change your prefix ( default is <!> )",
  run: async (client: Client, message: Message, args: string[]) => {
    if (args.length === 0) {
      return await message.reply("No args provided! ( !prefix <your prefix> )");
    }

    const cache: CacheProps = await cacheGet(message.guild.id);
    if (cache.prefix.name !== null) {
      await cacheSet(message.guild.id, {
        ...cache,
        prefix: {
          name: args[0],
        },
      });

      await prisma.guild.update({
        where: {
          guildID: message.guild.id,
        },
        data: {
          prefix: args[0],
        },
      });

      await message.reply(`Your guild prefix changed to **${args[0]}**`);
    }
  },
};
