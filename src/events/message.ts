import { Event, Command } from "../interface";
import { Message } from "discord.js";
import { cacheGet } from "../lib/Cache";
import { embedBuilder } from "../lib/Builder";

export const event: Event = {
  name: "message",
  run: async (client, message: Message) => {
    let args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);
    if (message.author?.bot) return;

    const currentCache = await cacheGet(message.guild.id);
    const channels = [
      currentCache.instagramChannel.channel || null,
      currentCache.darknetChannel.channel || null,
      currentCache.facebookChannel.channel || null,
      currentCache.twitterChannel.channel || null,
      currentCache.cargrChannel.channel || null,
    ];

    const find = channels.includes(message.channel.id);

    if (find) {
      //TODO: REFACTOR THIS FUCKING SHIT CODE!

      for (let channel of Object.values(currentCache)) {
        if (channel["channel"] === message.channel.id) {
          const content = message.content;
          const image =
            message.attachments.size > 0
              ? message.attachments.array()[0].url
              : null;
          let addImage = null;
          if (image) {
            addImage = image;
          }
          await message.delete({ timeout: 100 });
          await embedBuilder(
            message,
            channel["name"],
            content,
            null,
            addImage,
            null,
            "#0099ff",
            client
          );
        }
      }
    }

    const cmd = args.shift()!.toLocaleLowerCase();
    if (!cmd) return;

    const command = client.commands.get(cmd) || client.aliases.get(cmd);
    if (command) {
      (command as Command).run(client, message, args);
    }
  },
};
