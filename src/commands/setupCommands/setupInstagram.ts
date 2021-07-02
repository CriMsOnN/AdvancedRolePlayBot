import { Command, Config } from "../../interface";
import prisma from "../../prisma";
import { cacheGet, cacheSet } from "../../lib/Cache";

export const command: Command = {
  name: "setupinstagram",
  aliases: ["si"],
  label: "Setup Instagram",
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
      const currentCache = await cacheGet(message.guild.id);
      await cacheSet(message.guild.id, {
        ...currentCache,
        instagramChannel: {
          channel: instagramString,
          name: currentCache.instagramChannel.name,
        },
      });

      return await message.reply(`<#${instagramString}> setup finished!`);
    } else {
      return await message.reply(`The specified channel doesnt exist`);
    }
  },
};
