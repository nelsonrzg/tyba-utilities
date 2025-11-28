import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidatorFileService } from '../infrastructure/validator-file.service';
import { parse } from 'csv-parse/sync';

@Controller('validator')
export class ValidatorFileController {

  constructor(private readonly validatorFileService: ValidatorFileService) {}

  @Post('f22')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTxtFile(
    @UploadedFile() file: Express.Multer.File) {
      if (!file) {
        console.log('No file uploaded');
        throw new HttpException(`No file uploaded`, HttpStatus.BAD_REQUEST);
      }  

      const filename = file.originalname || '';
      if (!filename.toLowerCase().endsWith('.csv')) {
        console.log(`Invalid file extension: ${filename}`);
        throw new HttpException('The file must get .csv extention', HttpStatus.BAD_REQUEST);
      }
      
      const csvContent: any[] = await parse(file.buffer.toString(), {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
      });

      if (!csvContent[0] || !csvContent[0]['dato']) {
        console.log('Missing "dato" column in CSV header');
        throw new HttpException('The CSV must contain a "dato" column in the header', HttpStatus.BAD_REQUEST);
      }
      
      console.log('Begin validation process for F22 file ' + file.originalname);
      const totalRecords = await this.validatorFileService.processFile(csvContent);
      return { totalRecords };
    }
}
