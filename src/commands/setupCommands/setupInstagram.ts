import { Command, Config } from "../../interface";
import { Client } from "discord.js";
import { embedBuilder } from "../../lib/Builder";
import prisma from "../../prisma";
import { cacheSet } from "../../lib/Cache";

export const command: Command = {
  name: "setupinstagram",
  aliases: ["si"],
  label: "SetupInstagram",
  run: async (client, message, args) => {
    if (args.length === 0) {
      return await message.reply(
        "No args provided! ( !si or !setupinstagram channelID )"
      );
    }

    const instagram = +args[0];

    if (typeof instagram !== "number") {
      return await message.reply("You need to provide the channel ID");
    }

    const instagramString = args[0];
    if (message.guild.channels.cache.get(instagramString)) {
      const instagramchannel = await prisma.guild.update({
        where: {
          guildID: message.guild.id,
        },
        data: {
          instagramChannel: instagramString,
        },
      });

      cacheSet(`instagramchannel_${message.guild.id}`, instagramString);

      return await message.reply(`<#${instagramString}> setup finished!`);
    } else {
      return await message.reply(`The specified channel doesnt exist`);
    }
  },
};
