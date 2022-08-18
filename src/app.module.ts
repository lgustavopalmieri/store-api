import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ReportsModule } from './modules/reports/reports.module';
import getConfig from './config';
import { ConfigModule } from '@nestjs/config';

const config = getConfig();

const DATABASE_SETUP = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRoot({
    ...(config.database as TypeOrmModuleOptions),
    entities: ['dist/modules/**/entities/**.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/**/*.js'],
    migrationsTableName: 'migrations_store-api',
    migrationsRun: true,
  }),
];

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'store-api-db',
    //   port: 5432,
    //   username: 'store-api-user',
    //   password: 'store',
    //   database: 'store-api-database',
    //   entities: ['dist/modules/**/entities/**.entity{.ts,.js}'],
    //   migrations: ['dist/database/migrations/**/*.js'],
    //   synchronize: false,
    //   cli: {
    //     migrationsDir: 'src/database/migrations',
    //     entitiesDir: 'src',
    //   },
    // }),
    ...DATABASE_SETUP,
    UsersModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
