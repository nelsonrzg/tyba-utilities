import { TxtFileService } from '../infrastructure/txt-file.service';
export declare class TxtFileController {
    private readonly txtFileService;
    constructor(txtFileService: TxtFileService);
    uploadTxtFile(file: Express.Multer.File): Promise<{
        totalRecords: string;
    }>;
}
