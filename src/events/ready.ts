import { Event } from "../interface";

export const event: Event = {
  name: "ready",
  run: (client) => {
    console.log(`${client.user?.tag} is online`);
  },
};
