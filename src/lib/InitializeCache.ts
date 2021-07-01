import prisma from "../prisma";
import { cacheSet } from "./Cache";
import * as pogger from "pogger";

export const init = async () => {
  const guilds = await prisma.guild.findMany({});
  pogger.event("Initialize Cache");
  guilds.forEach(
    ({
      guildID,
      prefix,
      instagramChannel,
      darknetChannel,
      facebookChannel,
      twitterChannel,
      cargrChannel,
      logsChannel,
      serverIP,
      welcomeLeaveChannel,
      muteRoleID,
      name,
    }) => {
      cacheSet(guildID, {
        instagramChannel,
        darknetChannel,
        facebookChannel,
        twitterChannel,
        cargrChannel,
        logsChannel,
        serverIP,
        welcomeLeaveChannel,
        muteRoleID,
        name,
      });
      pogger.success(`${name} initialized!`);
    }
  );
};
