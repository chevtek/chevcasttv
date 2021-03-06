const configKeys = [ 
  "APP_URL",
  "CHEV_ID",
  "CONTEXT_TIMEOUT",
  "DATABASE_NAME",
  "DISCORD_API_URL",
  "DISCORD_BOT_TOKEN",
  "DISCORD_CDN_URL",
  "DISCORD_CLIENT_ID",
  "DISCORD_CLIENT_SECRET",
  "DISCORD_OAUTH_URL",
  "GOOGLE_API_KEY",
  "JWT_SECRET",
  "MONGODB_CONNECTION_STRING",
  "NODE_ENV",
  "RESTREAM_OAUTH_URL",
  "RESTREAM_CLIENT_ID",
  "RESTREAM_CLIENT_SECRET",
  "RESTREAM_CHAT_WEBSOCKET",
  "SESSION_SECRET",
  "TWITCH_API_URL",
  "TWITCH_CLIENT_ID",
  "TWITCH_CLIENT_SECRET",
  "TWITCH_OAUTH_URL"
] as const;

type Config = Record<typeof configKeys[number], string>;

const config = configKeys.reduce((config, key) => {
  if (!process.env[key]) throw new Error(`Environment variable ${key} is not defined but is required for this app to run.`);
  config[key] = process.env[key]!
  return config;
}, {} as Partial<Config>) as Config;

export default config;