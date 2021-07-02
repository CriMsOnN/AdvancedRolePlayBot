import { MessageEmbed, Message, Client } from "discord.js";

interface fieldsProps {
  title: string;
  value: string;
  inline?: boolean;
}

export const embedBuilder = async (
  message: Message,
  title?,
  description?,
  author?,
  image?,
  fields?: fieldsProps[],
  color?,
  client?: Client
) => {
  const embed: MessageEmbed = new MessageEmbed();

  if (title) {
    embed.setTitle(title);
  }

  if (description) {
    embed.setDescription(description);
  }

  if (author) {
    embed.setAuthor(author);
  }

  if (image) {
    embed.setImage(image);
  }

  if (fields) {
    fields.forEach((field) => {
      embed.addField(field.title, `${field.value}`, field?.inline);
    });
  }

  if (color) {
    embed.setColor(color);
  }

  embed.setThumbnail(client.user.displayAvatarURL());

  embed.setFooter(
    "Advanced RolePlay Bot by Cr1MsOn",
    client.user.displayAvatarURL({ dynamic: true })
  );

  await message.channel.send({ embed });
};
