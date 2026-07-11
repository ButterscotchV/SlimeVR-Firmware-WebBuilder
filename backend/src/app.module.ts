import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirmwareModule } from "./firmware/firmware.module";
import { connectionSource } from "./config/typeorm.datasource";
import { CacheModule } from "@nestjs/cache-manager";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      dataSourceFactory: async () => {
        return connectionSource.initialize();
      },
    }),
    FirmwareModule,
    // Serve robots.txt (& more)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
