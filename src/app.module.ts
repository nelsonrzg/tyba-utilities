
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValidatorFileController } from './interfaces/validator-file.controller';
import { ValidatorFileService } from './infrastructure/validator-file.service';
import { CountTxtRecordsUseCase } from './application/count-txt-records.usecase';

@Module({
  imports: [
    MulterModule.register({
      storage: undefined, // default memory storage
    }),
  ],
  controllers: [AppController, ValidatorFileController],
  providers: [AppService, ValidatorFileService, CountTxtRecordsUseCase],
})
export class AppModule {}
