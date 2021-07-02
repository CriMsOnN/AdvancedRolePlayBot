import { Command, Config } from "../../interface";
import { Client, Message, MessageEmbed } from "discord.js";
import { embedBuilder } from "../../lib/Builder";
import { cacheGet } from "../../lib/Cache";
import { CacheProps } from "../../interface/cache";
import fetch from "node-fetch";

export const command: Command = {
  name: "players",
  aliases: ["players"],
  label: "Total Players",
  run: async (client: Client, message: Message, args) => {
    function splitArrayIntoChunksOfLen(arr, len) {
      var chunks = [],
        i = 0,
        n = arr.length;
      console.log(len, n);
      while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
      }
      return chunks;
    }
    const Cache: CacheProps = await cacheGet(message.guild.id);

    if (Cache.serverIP.ip !== null) {
      const serverip = Cache.serverIP.ip;
      const response = await fetch(`http://${serverip}/players.json`);
      if (response.ok) {
        const results = await response.json();

        if (results.length === 0) {
          return message.reply("Server is starting up!");
        }
        const splittedArrays = splitArrayIntoChunksOfLen(results, 25);
        const pages = splittedArrays.length;
        let currentPage = 0;
        const embed = new MessageEmbed();
        embed.setTitle(`Total Players: ${results.length}`);

        splittedArrays[currentPage].forEach((player) => {
          embed.addField(
            `Player: ${player.name}`,
            `Ping: ${player.ping}`,
            true
          );
        });

        embed.setFooter(`Pages: ${currentPage + 1}/${pages}`);

        message.channel.send({ embed: embed }).then(async (embedMessage) => {
          await embedMessage.react("⏮️");
          await embedMessage.react("⏭️");
          const filter = (reaction, user) =>
            message.author.id !== client.user.id;
          const collector = embedMessage.createReactionCollector(filter);
          collector.on("collect", async (reaction, user) => {
            if (reaction.emoji.name === "⏭️") {
              currentPage += 1;
              const embed = embedMessage.embeds[0];
              if (currentPage >= pages) {
                currentPage -= 1;
                embedMessage.reactions.cache
                  .find((r) => r.emoji.name === "⏭️")
                  .users.remove(message.author.id);
                return;
              }
              embed.spliceFields(
                splittedArrays[currentPage].length,
                embed.fields.length
              );
              splittedArrays[currentPage].forEach((player, index) => {
                embed.fields[index] = {
                  name: `Player: ${player.name}`,
                  value: `Ping: ${player.ping}`,
                  inline: true,
                };
              });
              embed.setFooter(`Pages: ${currentPage + 1}/${pages}`);
              await embedMessage.edit(embed);
              embedMessage.reactions.cache
                .find((r) => r.emoji.name === "⏭️")
                .users.remove(message.author.id);
            } else if (reaction.emoji.name === "⏮️") {
              currentPage -= 1;
              if (currentPage < 0) {
                currentPage = 0;
              }
              const embed = embedMessage.embeds[0];
              splittedArrays[currentPage].forEach((player, index) => {
                embed.fields[index] = {
                  name: `Player: ${player.name}`,
                  value: `Ping: ${player.ping}`,
                  inline: true,
                };
              });
              embed.setFooter(`Pages: ${currentPage + 1}/${pages}`);
              await embedMessage.edit(embed);
              embedMessage.reactions.cache
                .find((r) => r.emoji.name === "⏮️")
                .users.remove(message.author.id);
            }
          });
        });
      } else {
        message.reply("Server is offline!");
      }
    }
  },
};
