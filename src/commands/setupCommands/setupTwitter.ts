import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import prisma from "../../prisma";
import { cacheGet, cacheSet } from "../../lib/Cache";

export const command: Command = {
  name: "setuptwitter",
  aliases: ["st"],
  label: "Setup Twitter",
  run: async (client: Client, message: Message, args: string[]) => {
    if (args.length === 0) {
      return await message.reply(
        "No args provided! ( !st or !setuptwitter channelID )"
      );
    }

    const twitter = +args[0];

    if (typeof twitter !== "number") {
      return await message.reply("You need to provide the channel ID");
    }

    const twitterstring = args[0];
    if (message.guild.channels.cache.get(twitterstring)) {
      const facebookchannel = await prisma.guild.update({
        where: {
          guildID: message.guild.id,
        },
        data: {
          twitterChannel: twitterstring,
        },
      });

      const currentCache = await cacheGet(message.guild.id);
      await cacheSet(message.guild.id, {
        ...currentCache,
        twitterChannel: {
          channel: twitterstring,
          name: currentCache.twitterChannel.name,
        },
      });

      return await message.reply(`<#${twitterstring}> setup finished!`);
    } else {
      return await message.reply(`The specified channel doesnt exist`);
    }
  },
};
