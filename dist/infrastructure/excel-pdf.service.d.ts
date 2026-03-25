export declare class ExcelPdfService {
    private readonly logger;
    generatePdfFromExcel(file: Express.Multer.File): Promise<{
        outputPaths: string[];
    }>;
}
