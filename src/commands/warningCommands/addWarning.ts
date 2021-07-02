import { Command, Config } from "../../interface";
import { Client, Message } from "discord.js";
import prisma from "../../prisma";
import { cacheGet, cacheSet } from "../../lib/Cache";

export const command: Command = {
  name: "warning",
  aliases: ["wg"],
  label: "Warning",
  run: async (client: Client, message: Message, args: string[]) => {
    const user = message.mentions.members.first();

    if (!user) {
      return await message.reply(`I cant find that user. Please try again`);
    }

    const count = await prisma.warnings.count({
      where: {
        user_name: user.user.username,
      },
    });

    await prisma.warnings.create({
      data: {
        user_name: user.user.username,
        user_id: user.user.id,
        guildID: message.guild.id,
      },
    });

    await message.reply(`Warning added to **${user.user.username}**`);
    if (count > 0) {
      await message.reply(
        `**${user.user.username}** has **${count}** warnings`
      );
    }
    // if (mutedRole) {
    //     await cacheSet(message.guild.id, {
    //         ...Cache,
    //         mutedRoleID: {
    //             mutedRole.id
    //         }
    //     })
    // }

    // const guild = message.guild.id;
    // const fetchRoles = await message.guild.roles.fetch();
    // const filteredRoles = fetchRoles.cache.filter(
    //   (role) => role.name === "warning"
    // );
    // if (filteredRoles) {
    //   const warningRole = filteredRoles.map((role) => role.id);
    //   const userID = message.member.id;

    //   await cacheSet(message.guild.id, {
    //       ...Cache,
    //       mutedRoleId: {
    //           muted
    //       }
    //   })

    //   await message.member.roles.add(warningRole);
    // } else {
    //   await message.reply(
    //     `I didnt find any warning role. I will create one for you`
    //   );
    // }

    // await prisma.warnings.create({
    //   data: {
    //     user_name: user.user.username,
    //     user_id: user.user.id,
    //     guildID: message.guild.id,
    //   },
    // });
  },
};
