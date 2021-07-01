import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import { embedBuilder } from "../../lib/Builder";
import prisma from "../../prisma";

export const command: Command = {
  name: "setupcargr",
  aliases: ["sc"],
  label: "Setup Car.gr",
  run: async (client: Client, message: Message, args: string[]) => {
    if (args.length === 0) {
      return await message.reply(
        "No args provided! ( !sc or !setupcargr channelID )"
      );
    }

    const cargr = +args[0];

    if (typeof cargr !== "number") {
      return await message.reply("You need to provide the channel ID");
    }

    const cargrstring = args[0];
    if (message.guild.channels.cache.get(cargrstring)) {
      const facebookchannel = await prisma.guild.update({
        where: {
          guildID: message.guild.id,
        },
        data: {
          cargrChannel: cargrstring,
        },
      });

      return await message.reply(`<#${cargrstring}> setup finished!`);
    } else {
      return await message.reply(`The specified channel doesnt exist`);
    }
  },
};
