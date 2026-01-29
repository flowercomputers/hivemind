import { Static, Type } from "@sinclair/typebox";
import envSchema from "env-schema";
import * as path from "node:path";

enum NodeEnv {
  development = "development",
  production = "production",
  test = "test",
}

export enum LogLevel {
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
}

const schema = Type.Object({
  VERSION: Type.String({ default: "0.0.0" }),
  LOG_LEVEL: Type.Enum(LogLevel),
  NODE_ENV: Type.Enum(NodeEnv),
  HOST: Type.String({ default: "localhost" }),
  PORT: Type.Number({ default: 3000 }),
  FABRIC_URL: Type.String(),
  FABRIC_API_KEY: Type.String(),
});

const envFileSuffix = (env?: string) => {
  switch (env) {
    case NodeEnv.production: {
      return "prod";
    }
    case NodeEnv.test: {
      return "test";
    }
    default: {
      return "local";
    }
  }
};

const env = envSchema<Static<typeof schema>>({
  dotenv: {
    path: [
      path.join(
        process.cwd(),
        "./",
        `.env.${envFileSuffix(process.env.NODE_ENV)}`,
      ),
      path.join(process.cwd(), "./", ".env.local"),
      path.join(process.cwd(), "./", ".env"),
    ],
  },
  schema,
});

export default {
  version: env.VERSION,
  nodeEnv: env.NODE_ENV,
  isDevelopment: env.NODE_ENV === NodeEnv.development,
  isProduction: env.NODE_ENV === NodeEnv.production,
  log: {
    level: env.LOG_LEVEL,
  },
  server: {
    host: env.HOST,
    port: env.PORT,
  },
  fabric: {
    url: env.FABRIC_URL,
    apiKey: env.FABRIC_API_KEY,
  },
};
