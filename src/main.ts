import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { join } from 'path';
import { TransformInterceptor } from './core/transform.interceptor';
import { ValidationPipe, VersioningType  } from '@nestjs/common';


async function bootstrap() {
  //use Express application
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
 
  //config services
  const configService = app.get(ConfigService)
 
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
 
 
  //config static files
  app.useStaticAssets(join(__dirname, '..', 'src/public'));
  //config views
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  //config viewEngine
  app.setViewEngine('ejs');
 
    //config cors
    app.enableCors(
     {
       "origin": true,
       "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
       "preflightContinue": false,
       "optionsSuccessStatus": 204,
       credentials: true
     }
   );

   //config verioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],//version 1
  });
 
   app.useGlobalPipes(new ValidationPipe());
 
   await app.listen(configService.get<string>('PORT'));
 }
 bootstrap();