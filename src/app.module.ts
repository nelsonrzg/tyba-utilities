
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TxtFileController } from './interfaces/txt-file.controller';
import { TxtFileService } from './infrastructure/txt-file.service';
import { CountTxtRecordsUseCase } from './application/count-txt-records.usecase';

@Module({
  imports: [
    MulterModule.register({
      storage: undefined, // default memory storage
    }),
  ],
  controllers: [AppController, TxtFileController],
  providers: [AppService, TxtFileService, CountTxtRecordsUseCase],
})
export class AppModule {}
