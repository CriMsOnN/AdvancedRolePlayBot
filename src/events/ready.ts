import { Event } from "../interface";

export const event: Event = {
  name: "ready",
  run: (client) => {
    client.logger.info(`${client.user.tag} is online!`);
  },
};
