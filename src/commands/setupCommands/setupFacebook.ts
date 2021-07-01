import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import { embedBuilder } from "../../lib/Builder";
import prisma from "../../prisma";

export const command: Command = {
  name: "setupfacebook",
  aliases: ["sf"],
  label: "Setup Facebook",
  run: async (client: Client, message: Message, args: string[]) => {
    if (args.length === 0) {
      return await message.reply(
        "No args provided! ( !sf or !setupfacebook channelID )"
      );
    }

    const facebook = +args[0];

    if (typeof facebook !== "number") {
      return await message.reply("You need to provide the channel ID");
    }

    const facebookstring = args[0];
    if (message.guild.channels.cache.get(facebookstring)) {
      const facebookchannel = await prisma.guild.update({
        where: {
          guildID: message.guild.id,
        },
        data: {
          facebookChannel: facebookstring,
        },
      });

      return await message.reply(`<#${facebookstring}> setup finished!`);
    } else {
      return await message.reply(`The specified channel doesnt exist`);
    }
  },
};
