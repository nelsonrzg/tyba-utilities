import { CountTxtRecordsUseCase } from '../application/count-txt-records.usecase';
export declare class ValidatorFileService {
    private readonly countTxtRecordsUseCase;
    constructor(countTxtRecordsUseCase: CountTxtRecordsUseCase);
    processFile(file: any[]): Promise<string>;
}
