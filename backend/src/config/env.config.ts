import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

interface EnvConfig {
  nodeEnv: string;
  port: number;
  apiVersion: string;

  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };

  jwt: {
    secret: string;
    expiresIn: string;
  };

  redis: {
    host: string;
    port: number;
  };
}

class Environment {
  private config: EnvConfig;

  constructor() {
    this.config = {
      nodeEnv: process.env.NODE_ENV || "development",
      port: parseInt(process.env.PORT || "3000", 10),
      apiVersion: process.env.API_VERSION || "v1",

      database: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        name: process.env.DB_NAME || "taskmaster_dev",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
      },

      jwt: {
        secret: process.env.JWT_SECRET || "change-this-secret",
        expiresIn: process.env.EXPIRES_IN || "7d",
      },

      redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
      },
    };
    this.validateConfig();
  }

  private validateConfig(): void {
    if (this.config.nodeEnv === "production") {
      if (this.config.jwt.secret === "change-this-secret") {
        throw new Error("JWT_SECRET must be set in production");
      }
    }

    if (!this.config.database.password) {
      throw new Error("DB_PASSWORD must be set in production");
    }
  }

  public get(): EnvConfig {
    return this.config;
  }
}

export const env = new Environment().get();
