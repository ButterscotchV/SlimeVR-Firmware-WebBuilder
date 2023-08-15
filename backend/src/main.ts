import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { configService } from './config/config.service';

async function bootstrap() {
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });

  const corsWhitelist = [
    configService.getHostUrl(),
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || corsWhitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS: ' + origin));
        }
      },
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Slimevr API')
    .setDescription('Slimy things')
    .setVersion('1.0')
    .addTag('slimevr')
    .addServer(configService.getHostUrl(), 'main server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      defaultModelRendering: 'model',
    },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // Use Class validator on all endpoints for all input and output payloads
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); // Allow injectable into classvalidator

  await app.listen(3000);
}
bootstrap();
