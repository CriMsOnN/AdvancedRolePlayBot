import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import prisma from "../../prisma";
import { cacheGet, cacheSet } from "../../lib/Cache";

export const command: Command = {
  name: "setupwelcome",
  aliases: ["sw"],
  label: "Setup Welcome & Leave",
  description: "Setup welcome & leave channel",
  run: async (client: Client, message: Message, args: string[]) => {
    if (args.length === 0) {
      return await message.reply(
        "No args provided! ( !sw or !setupwelcome channelID )"
      );
    }

    const welcome = +args[0];

    if (typeof welcome !== "number") {
      return await message.reply("You need to provide the channel ID");
    }

    const welcomestring = args[0];
    if (message.guild.channels.cache.get(welcomestring)) {
      const facebookchannel = await prisma.guild.update({
        where: {
          guildID: message.guild.id,
        },
        data: {
          welcomeLeaveChannel: welcomestring,
        },
      });

      const currentCache = await cacheGet(message.guild.id);
      await cacheSet(message.guild.id, {
        ...currentCache,
        welcomeLeaveChannel: {
          channel: welcomestring,
          name: currentCache.welcomeLeaveChannel.name,
        },
      });

      return await message.reply(`<#${welcomestring}> setup finished!`);
    } else {
      return await message.reply(`The specified channel doesnt exist`);
    }
  },
};
