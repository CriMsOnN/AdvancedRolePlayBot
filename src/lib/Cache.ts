import { promisify } from "util";
import redis from "redis";
import * as pogger from "pogger";
const client = redis.createClient();

export const getAsync = promisify(client.get).bind(client);
export const setAsync = promisify(client.set).bind(client);
export const setexAsync = promisify(client.setex).bind(client);
export const ttlAsync = promisify(client.ttl).bind(client);

client.on("error", (error) => {
  console.error(error);
});

/**
 * @param {string} key key for the cache entry
 * @param {*} value any object/string/number
 */

export const cacheSet = async (key, value) => {
  pogger.info(`${key} added to cache with value ${value}`);
  return await setAsync(key, JSON.stringify(value));
};

/** Retrieves data for given key
 * @param {string} key key of the cached entry
 */

export const cacheGet = async (key) => {
  const data = await getAsync(key);
  pogger.info(`${key} get from cache with value ${JSON.parse(data)}}`);
  return JSON.parse(data);
};
