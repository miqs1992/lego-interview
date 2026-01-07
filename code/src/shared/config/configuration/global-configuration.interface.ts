export interface GlobalConfiguration {
  port: number;
  nodeEnv: string;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  queue: {
    host: string;
    port: number;
  };
}

export default GlobalConfiguration;
