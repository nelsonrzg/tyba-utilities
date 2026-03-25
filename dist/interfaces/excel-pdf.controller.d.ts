import { ExcelPdfService } from '../infrastructure/excel-pdf.service';
export declare class ExcelPdfController {
    private readonly excelPdfService;
    constructor(excelPdfService: ExcelPdfService);
    uploadAndGeneratePdf(file: Express.Multer.File): Promise<{
        message: string;
        outputPaths: string[];
    }>;
}
