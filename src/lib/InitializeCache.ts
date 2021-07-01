import prisma from "../prisma";
import { cacheSet } from "./Cache";
import * as pogger from "pogger";

export const init = async () => {
  const guilds = await prisma.guild.findMany({});
  pogger.event("Initialize Cache");
  guilds.forEach((guild) => {
    cacheSet(`prefix_${guild.guildID}`, guild.prefix);
    cacheSet(`instagramchannel_${guild.guildID}`, guild.instagramChannel);
    cacheSet(`darknetchannel_${guild.guildID}`, guild.darknetChannel);
    cacheSet(`facebookchannel_${guild.guildID}`, guild.facebookChannel);
    cacheSet(`twitterchannel_${guild.guildID}`, guild.twitterChannel);
    cacheSet(`cargrchannel_${guild.guildID}`, guild.cargrChannel);
    cacheSet(`logschannel_${guild.guildID}`, guild.logsChannel);
    cacheSet(`serverip_${guild.guildID}`, guild.serverIP);
    cacheSet(`welcomeleavechannel_${guild.guildID}`, guild.welcomeLeaveChannel);
    cacheSet(`muteroleid_${guild.guildID}`, guild.muteRoleID);
    pogger.success(`${guild.name} initialized!`);
  });
};
