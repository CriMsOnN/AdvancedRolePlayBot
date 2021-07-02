import { Event } from "../interface";
import { Guild, GuildMember, TextChannel } from "discord.js";
import prisma from "../prisma";

export const event: Event = {
  name: "guildMemberUpdate",
  run: async (client, oldMember: GuildMember, newMember: GuildMember) => {
    const oldState = oldMember.premiumSince;
    const newState = newMember.premiumSince;
    if (!oldState && newState) {
      const channel = newMember.guild.channels.cache.get("798168078990180382");
      (channel as TextChannel).send(
        `${newMember.user.username} boosted this server`
      );
    }
  },
};
