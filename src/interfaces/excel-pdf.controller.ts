import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelPdfService } from '../infrastructure/excel-pdf.service';

@Controller('excel')
export class ExcelPdfController {
  constructor(private readonly excelPdfService: ExcelPdfService) {}

  @Post('upload-to-pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndGeneratePdf(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const fileName = file.originalname || '';
    if (!fileName.toLowerCase().endsWith('.xlsx') && !fileName.toLowerCase().endsWith('.xls')) {
      throw new HttpException('El archivo debe ser un Excel (.xlsx o .xls)', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.excelPdfService.generatePdfFromExcel(file);
      return {
        message: 'PDF(s) generado(s) exitosamente',
        outputPaths: result.outputPaths,
      };
    } catch (error) {
      throw new HttpException(`Error generando PDF: ${error.message ?? error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
