import { Client, Collection } from "discord.js";
import path from "path";
import { readdirSync } from "fs";
import { Command, Event } from "../interface";
import { CONFIG } from "../config";
import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export default class BotInstance extends Client {
  public commands: Collection<string, Command> = new Collection();
  public events: Collection<string, Event> = new Collection();
  public aliases: Collection<string, Command> = new Collection();
  public config = CONFIG;

  async start() {
    await this.login(this.config.token);

    const commandP = path.join(__dirname, "..", "commands");
    readdirSync(commandP).forEach((dir) => {
      const commands = readdirSync(`${commandP}/${dir}`).filter((file) =>
        file.endsWith(".ts")
      );
      for (const file of commands) {
        const { command } = require(`${commandP}/${dir}/${file}`);
        this.commands.set(command.name, command);
        console.log(`[${command.label.toUpperCase()}] registered ✔`);

        if (command?.aliases.length !== 0) {
          command.aliases.forEach((alias: unknown) => {
            this.aliases.set(alias as string, command);
          });
        }
      }
    });

    const eventPath = path.join(__dirname, "..", "events");
    readdirSync(eventPath).forEach(async (file) => {
      const { event } = await import(`${eventPath}/${file}`);
      this.events.set(event.name, event);
      console.log(`[${event.name.toUpperCase()}] registered`);
      this.on(event.name, event.run.bind(null, this));
    });
  }
}
