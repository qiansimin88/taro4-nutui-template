declare const process: {
  env: {
    NODE_ENV: string;
  };
};

const isDev = process.env.NODE_ENV === "development";

interface EnvConfig {
  /** API base URL */
  apiBaseUrl: string;
  /** Enable debug mode */
  debug: boolean;
  /** Request timeout (ms) */
  timeout: number;
}

const devConfig: EnvConfig = {
  apiBaseUrl: "https://dev-api.example.com",
  debug: true,
  timeout: 30000,
};

const prodConfig: EnvConfig = {
  apiBaseUrl: "https://api.example.com",
  debug: false,
  timeout: 30000,
};

export const env: EnvConfig = isDev ? devConfig : prodConfig;

export default env;
