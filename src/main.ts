import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 6000;
  app.enableCors();
  app.use(
    cookieSession({
      keys: ['cookieKey'],
    }),
  ),
    app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
