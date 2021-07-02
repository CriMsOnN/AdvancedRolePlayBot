import { Event } from "../interface";
import prisma from "../prisma/index";
import { Guild } from "discord.js";

export const event: Event = {
  name: "voiceStateUpdate",
  run: async (_, state) => {
    const channel = state.guild.channels.cache.get("798168078990180382");
    const roleid = state.guild.roles.cache.find(
      (role) => role.id === "798164540995010623"
    );
    if (state.channelID === "798164541594402829") {
      channel.send(`${roleid} hello`);
    }
  },
};
