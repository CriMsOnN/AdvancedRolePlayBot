import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import { embedBuilder } from "../../lib/Builder";
import prisma from "../../prisma";
import { cacheGet, cacheSet } from "../../lib/Cache";
import { CacheProps } from "../../interface/cache";

export const command: Command = {
  name: "removemute",
  aliases: ["rm"],
  label: "Remove Mute",
  run: async (client: Client, message: Message, args) => {
    const user = message.mentions.members.first();

    if (!user) {
      return await message.reply(`I cant find that user. Please try again!`);
    }

    const Cache: CacheProps = await cacheGet(message.guild.id);

    if (Cache.muteRoleID.id !== null) {
      await user.roles.remove(Cache.muteRoleID.id);
      await message.reply(`Mute role removed from ${user.user.username}`);
    } else {
      await message.reply(
        `Seems you dont have specified mute role id. I will try to find one`
      );

      const role = message.guild.roles.cache.find(
        (role) => role.name === "muted"
      );

      if (role) {
        await message.reply(
          `Found one role with name muted! i am using that one`
        );

        user.roles.remove(role);

        await cacheSet(message.guild.id, {
          ...Cache,
          muteRoleID: {
            id: role,
          },
        });

        await prisma.guild.update({
          where: {
            guildID: message.guild.id,
          },
          data: {
            muteRoleID: role.id,
          },
        });

        await message.reply(`Mute role removed from ${user.user.username}`);
      } else {
        await message.reply(
          `Whoops. I think you dont have any specified mute role. Try !addmute @member to create one and assign it`
        );
      }
    }
  },
};
