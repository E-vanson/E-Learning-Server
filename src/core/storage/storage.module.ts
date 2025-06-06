import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { FILE_STORAGE_SERVICE } from './file-storage.service';
import { LocalFileStorageService } from './local-file-storage.service';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          limits: {
            fileSize: 20 * 1024 * 1024,
          },
          storage: diskStorage({
            destination: (req, file, cb) => {
              const date = new Date();
              const month = date.getMonth() + 1;
              const fm = month < 10 ? `0${month}` : month;
              const basePath = configService.get<string>('IMAGE_PATH');
              console.log("The base path....", basePath);
              const path = `${basePath}/${date.getFullYear()}/${fm}`;
              console.log("The path....", path);
              mkdirSync(path, { recursive: true });
              cb(null, path);
            },
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: FILE_STORAGE_SERVICE,
      useClass: LocalFileStorageService,
    },
  ],
  exports: [MulterModule, FILE_STORAGE_SERVICE],
})
export class StorageModule {}
