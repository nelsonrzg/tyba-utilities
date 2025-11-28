import { ValidatorFileService } from '../infrastructure/validator-file.service';
export declare class ValidatorFileController {
    private readonly validatorFileService;
    constructor(validatorFileService: ValidatorFileService);
    uploadTxtFile(file: Express.Multer.File): Promise<{
        totalRecords: string;
    }>;
}
