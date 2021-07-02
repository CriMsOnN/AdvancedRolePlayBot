import { Command, Config } from "../../interface";
import { Client } from "discord.js";
import { embedBuilder } from "../../lib/Builder";
import prisma from "../../prisma";

export const command: Command = {
  name: "setup",
  aliases: ["sch"],
  label: "Setup Channels",
  description: "Showing the list of channels",
  run: async (client: Client, message, args) => {
    const channels = await prisma.guild.findUnique({
      where: {
        guildID: message.guild.id,
      },
    });

    if (channels) {
      const instagramChannel = channels.instagramChannel;
      const darknetChannel = channels.darknetChannel;
      const facebookChannel = channels.facebookChannel;
      const twitterChannel = channels.twitterChannel;
      const cargrChannel = channels.cargrChannel;
      const welcomeLeaveChannel = channels.welcomeLeaveChannel;
      await embedBuilder(
        message,
        "Setup RolePlay Channels",
        "Default RolePlay Channels ( Instagram, Facebook, Darknet, Twitter, Car.gr, Logs, Welcome and Leave. You can setup all of them or choose any of them",
        null,
        null,
        [
          {
            title: "Instagram Channel",
            value: `${
              instagramChannel
                ? "<#" + instagramChannel + ">"
                : "**Not specified**"
            }`,
          },
          {
            title: "Darknet Channel",
            value: `${
              darknetChannel ? "<#" + darknetChannel + ">" : "**Not specified**"
            }`,
          },
          {
            title: "Facebook Channel",
            value: `${
              facebookChannel
                ? "<#" + facebookChannel + ">"
                : "**Not specified**"
            }`,
          },
          {
            title: "Twitter Channel",
            value: `${
              twitterChannel ? "<#" + twitterChannel + ">" : "**Not specified**"
            }`,
          },
          {
            title: "Car.gr Channel",
            value: `${
              cargrChannel ? "<#" + cargrChannel + ">" : "**Not specified**"
            }`,
          },
          {
            title: "Welcome & Leave Channel",
            value: `${
              welcomeLeaveChannel
                ? "<#" + welcomeLeaveChannel + ">"
                : "**Not Specified**"
            }`,
          },
        ],
        null,
        client
      );
    }
  },
};
