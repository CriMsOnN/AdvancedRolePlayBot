import { Event } from "../interface";
import prisma from "../prisma/index";
import { Guild } from "discord.js";

export const event: Event = {
  name: "guildCreate",
  run: async (client, guild: Guild) => {
    const guildID = await prisma.guild.findUnique({
      where: {
        guildID: guild.name,
      },
    });

    if (guildID) {
      return;
    } else {
      const newGUILD = await prisma.guild.create({
        data: {
          name: guild.name,
          guildID: guild.id,
        },
      });
      const id = guild.ownerID;
      guild.owner?.send(
        "Thanks for inviting me to your guild! You default settings have been saved to my database\n If you want to see my commands type ~help"
      );
    }
  },
};
