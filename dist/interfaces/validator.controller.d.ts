import { TxtFileService } from '../infrastructure/validator-file.service';
export declare class ValidatorController {
    private readonly txtFileService;
    constructor(txtFileService: TxtFileService);
    uploadTxtFile(file: Express.Multer.File): Promise<{
        totalRecords: any;
    }>;
}
