type Environment = "development" | "staging" | "preview" | "production";

interface Config {
  [key: string]: {
    apiBaseUrl: string;
    wsBaseUrl: string;
  };
}

import config from "./config.json";

const env: Environment =
  (process.env.VERCEL_ENV as Environment) || "development";

if (!config[env]) {
  throw new Error(`No configuration found for environment: ${env}`);
}

export const appConfig = config[env];
