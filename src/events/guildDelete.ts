import { Event } from "../interface";
import { Guild } from "discord.js";
import prisma from "../prisma";

export const event: Event = {
  name: "guildDelete",
  run: async (client, guild: Guild) => {
    const owner = guild.ownerID;

    const findGuild = await prisma.guild.findUnique({
      where: {
        guildID: guild.id,
      },
    });

    if (findGuild) {
      const deleted = await prisma.guild.delete({
        where: { guildID: guild.id },
      });
    } else {
      return;
    }
  },
};
