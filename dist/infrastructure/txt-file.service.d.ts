import { CountTxtRecordsUseCase } from '../application/count-txt-records.usecase';
export declare class TxtFileService {
    private readonly countTxtRecordsUseCase;
    constructor(countTxtRecordsUseCase: CountTxtRecordsUseCase);
    processFile(file: any[]): Promise<string>;
}
