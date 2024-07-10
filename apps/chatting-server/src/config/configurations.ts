export default () => ({
  env: process.env.NODE_ENV || "local",
  database: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.MYSQL_ROOT_USER || "root",
    password: process.env.MYSQL_ROOT_PASSWORD,
    name: process.env.DB_NAME,
    timezone: process.env.DB_TIMEZONE || "Z",
    slave: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.MYSQL_ROOT_USER,
      password: process.env.MYSQL_ROOT_PASSWORD || "",
      name: process.env.DB_NAME,
      timezone: process.env.DB_TIMEZONE || "Z",
    },
    config: {
      connectionLimit: parseInt(process.env.connectionLimit) || 5,
      maxIdle: parseInt(process.env.maxIdle) || 5,
      idleTimeout: parseInt(process.env.idleTimeout) || 7210000,
    },
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
});
