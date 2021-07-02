import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import { embedBuilder } from "../../lib/Builder";
import prisma from "../../prisma";
import { cacheGet, cacheSet } from "../../lib/Cache";
import { CacheProps } from "../../interface/cache";
import fetch from "node-fetch";

export const command: Command = {
  name: "status",
  aliases: ["status"],
  label: "Server Status",
  run: async (client: Client, message: Message, args: string[]) => {
    const Cache: CacheProps = await cacheGet(message.guild.id);
    if (Cache.serverIP.ip !== null) {
      const serverip = Cache.serverIP.ip;
      const response = await fetch(`http://${serverip}/dynamic.json`);
      if (response.ok) {
        const { hostname, clients, sv_maxclients } = await response.json();
        const regex = hostname.replace(/[^+]\d+/g, " ");
        const removeCharacters = regex.replace(/\|\|/g, " ");
        embedBuilder(
          message,
          `Server Status - ${Cache.serverName.name}`,
          `Hostname: ${removeCharacters}`,
          null,
          null,
          [
            {
              title: "Total Players",
              value: `${clients}/${sv_maxclients}`,
            },
          ]
        );
      }
    }
  },
};
