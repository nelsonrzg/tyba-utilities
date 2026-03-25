
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValidatorFileController } from './interfaces/validator-file.controller';
import { ExcelPdfController } from './interfaces/excel-pdf.controller';
import { ValidatorFileService } from './infrastructure/validator-file.service';
import { ExcelPdfService } from './infrastructure/excel-pdf.service';
import { CountTxtRecordsUseCase } from './application/count-txt-records.usecase';

@Module({
  imports: [
    MulterModule.register({
      storage: undefined, // default memory storage
    }),
  ],
  controllers: [AppController, ValidatorFileController, ExcelPdfController],
  providers: [AppService, ValidatorFileService, ExcelPdfService, CountTxtRecordsUseCase],
})
export class AppModule {}
