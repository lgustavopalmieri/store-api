import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ReportsModule } from './modules/reports/reports.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'store-api-db',
      port: 5432,
      username: 'store-api-user',
      password: 'store',
      database: 'store-api-database',
      entities: ['dist/modules/**/entities/**.entity{.ts,.js}'],
      migrations: ['dist/database/migrations/**/*.js'],
      synchronize: false,
      cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src',
      },
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
