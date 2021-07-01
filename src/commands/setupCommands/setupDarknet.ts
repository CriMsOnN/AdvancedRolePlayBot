import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import { embedBuilder } from "../../lib/Builder";
import prisma from "../../prisma";
import { cacheGet, cacheSet } from "../../lib/Cache";

export const command: Command = {
  name: "setupdarknet",
  aliases: ["sd"],
  label: "Setup Darknet",
  run: async (client: Client, message: Message, args: string[]) => {
    if (args.length === 0) {
      return await message.reply(
        "No args provided! ( !sd or !setupdarknet channelID )"
      );
    }

    const darknet = +args[0];

    if (typeof darknet !== "number") {
      return await message.reply("You need to provide the channel ID");
    }

    const darknetstring = args[0];
    if (message.guild.channels.cache.get(darknetstring)) {
      const facebookchannel = await prisma.guild.update({
        where: {
          guildID: message.guild.id,
        },
        data: {
          darknetChannel: darknetstring,
        },
      });

      const currentCache = await cacheGet(message.guild.id);
      await cacheSet(message.guild.id, {
        ...currentCache,
        darknetChannel: {
          channel: darknetstring,
          name: currentCache.darknetChannel.name,
        },
      });

      return await message.reply(`<#${darknetstring}> setup finished!`);
    } else {
      return await message.reply(`The specified channel doesnt exist`);
    }
  },
};
