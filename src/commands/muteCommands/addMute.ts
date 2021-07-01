import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import { embedBuilder } from "../../lib/Builder";
import prisma from "../../prisma";
import { cacheGet, cacheSet } from "../../lib/Cache";

export const command: Command = {
  name: "addmute",
  aliases: ["am"],
  label: "Add Mute",
  run: async (client: Client, message: Message, args: string[]) => {
    const user = message.mentions.members.first();

    if (!user) {
      return await message.reply(`I cant find that user. Please try again`);
    }

    const Cache = await cacheGet(message.guild.id);

    if (Cache.muteRoleID.id !== null) {
      await user.roles.add(Cache.muteRoleID.id);
    } else {
      await message.reply(
        `Seems you dont have any specified mute role id. I will try to find one!`
      );

      const guild = message.guild.id;
      const role = message.guild.roles.cache.find(
        (role) => role.name === "muted"
      );

      if (role) {
        await message.reply(
          `Found one role with name muted! I am using that one`
        );
        user.roles.add(role);

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
      } else {
        await message.reply(
          `Whoops. I think you dont have any muted role. Let me create one`
        );

        const createRole = await message.guild.roles.create({
          data: {
            name: "muted",
            color: "DARK_GREY",
            permissions: ["VIEW_CHANNEL"],
            mentionable: false,
          },
        });

        if (createRole) {
          const mutedRole = createRole.id;

          user.roles.add(mutedRole);
          await message.reply(
            `Muted role created and added to **${user.user.username}** \n Please remember to edit your channel permissions and deny any permission you want for muted members`
          );

          await cacheSet(message.guild.id, {
            ...Cache,
            muteRoleID: {
              id: mutedRole,
            },
          });
          await prisma.guild.update({
            where: {
              guildID: message.guild.id,
            },
            data: {
              muteRoleID: mutedRole,
            },
          });
        } else {
          await message.reply(
            `I was unable to create that role. Maybe something is wrong with my permissions!`
          );
        }
      }
    }
  },
};
