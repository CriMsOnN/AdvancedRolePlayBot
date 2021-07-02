import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import { embedBuilder } from "../../lib/Builder";
import prisma from "../../prisma";
import { cacheGet, cacheSet } from "../../lib/Cache";
import { CacheProps } from "../../interface/cache";
import fetch from "node-fetch";

export const command: Command = {
  name: "players",
  aliases: ["players"],
  label: "Total Players",
  run: async (client: Client, message: Message, args) => {
    const Cache: CacheProps = await cacheGet(message.guild.id);

    if (Cache.serverIP.ip !== null) {
      const serverip = Cache.serverIP.ip;
      const response = await fetch(`http://${serverip}/players.json`);
      if (response.ok) {
        const results = await response.json();
        const half = Math.ceil(results.length / 2);
        const leftSide = results.splice(0, half);
        const rightSide = results.splice(half, results.length);
        const players = [];

        leftSide.forEach((player) => {
          players.push({
            title: player.name,
            value: player.ping,
          });
        });
        await embedBuilder(
          message,
          "Players",
          `Total Players:`,
          null,
          null,
          players
        );
      }
    }
  },
};
