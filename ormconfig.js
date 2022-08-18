const env = {
  localhost: {
    type: 'postgres',
    host: 'store-api-db',
    port: 5432,
    username: 'store-api-user',
    password: 'store',
    database: 'store-api-database',
  },
};

const cli = {
  migrationsDir: 'src/database/migrations',
  entitiesDir: 'src',
};

module.exports = {
  // type: 'postgres',
  // host: 'store-api-db',
  // port: 5432,
  // username: 'store-api-user',
  // password: 'store',
  // database: 'store-api-database',
  cli,
  entities: ['dist/modules/**/entities/*.entity.js'],
  migrations: ['dist/database/migrations/**/*.js'],
  // synchronize: false,
  // cli: {
  //   migrationsDir: 'src/database/migrations',
  //   entitiesDir: 'src',
  // },
  migrationsTableName: 'migrations_store-api',
  ...(env[process.env.NODE_ENV] || {}),
};
