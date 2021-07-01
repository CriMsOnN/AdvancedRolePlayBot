import * as dotenv from "dotenv";
import path from "path";

(() => {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
  });
})();

export const CONFIG = {
  token: process.env.TOKEN,
  dev: process.env.NODE_ENV === "production",
  prefix: "!",
};
