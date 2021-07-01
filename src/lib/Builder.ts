import { MessageEmbed, Message } from "discord.js";

interface fieldsProps {
  title: string;
  value: string;
}

export const embedBuilder = async (
  message: Message,
  title?,
  description?,
  author?,
  image?,
  fields?: fieldsProps[],
  color?
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
      embed.addField(field.title, `${field.value}`);
    });
  }

  if (color) {
    embed.setColor(color);
  }

  embed.setThumbnail("https://imgur.com/cpD6l1z.png");

  embed.setFooter(
    "Advanced RolePlay Bot by Cr1MsOn",
    "https://imgur.com/cpD6l1z.png"
  );

  await message.channel.send({ embed });
};
