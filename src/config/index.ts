interface IConfig {
  database: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
}
const localhost = {
  database: {
    type: 'postgres',
    host: 'store-api-db',
    port: 5432,
    username: 'store-api-user',
    password: 'store',
    database: 'store-api-database',
  },
};
export default (): IConfig => {
  const env = { localhost };
  return env[process.env.NODE_ENV] || env.localhost;
};
