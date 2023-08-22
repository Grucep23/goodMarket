import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { ItemsModule } from './items/items.module';
import { StoresModule } from './stores/stores.module';
import { FilesModule } from './files/files.module';
import { DatabasesModule } from './databases/databases.module';


@Module({
  
  controllers: [AppController],
  providers: [AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  imports: [
    MongooseModule.forRootAsync({
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB'),
      connectionFactory: (connection) => {
        connection.plugin(softDeletePlugin);
        return connection;
        }
    }),
    inject: [ConfigService],
  }),
    ConfigModule.forRoot({isGlobal:true}),
    UsersModule,
    AuthModule,
    FilesModule,
    StoresModule,
    ItemsModule,
    PermissionsModule,
    RolesModule,
    FilesModule,
    DatabasesModule,
    DatabasesModule
  ]
})
export class AppModule {}
