import { Injectable } from '@nestjs/common';
import { CountTxtRecordsUseCase } from '../application/count-txt-records.usecase';

@Injectable()
export class ValidatorFileService {

  constructor(
    private readonly countTxtRecordsUseCase: CountTxtRecordsUseCase,
  ) {}

  async processFile(file: any[]): Promise<string> {
    let fund: string;
    let format: string;
    let countArray: { value: number; fund: string }[] = [];
    let recordType;
    let subAccountRecordTypeColumn;
    let clientCount: number = 0;
    let validationPassed: boolean = true;

    file.map((obj) => {
      const dato = obj.dato; 
      recordType = String(dato).substring(8,9);
      format = String(dato).substring(9, 12);
      if (recordType === '2') {
        fund = String(dato).substring(18, 24).trimStart();
        format = String(dato).substring(9, 12);
        clientCount = 0; 
      }
      if (recordType === '4' && format === '201') {
        subAccountRecordTypeColumn = dato.slice(12, 19);
        if (subAccountRecordTypeColumn === '0101005') {
          clientCount = clientCount + Number(dato.slice(21, 42).trim().replace(/^0+/, ''));
        } else if (subAccountRecordTypeColumn === '0101010') {
          clientCount = clientCount + Number(dato.slice(21, 42).trim().replace(/^0+/, ''));
        } else if (subAccountRecordTypeColumn === '0101015') {
          clientCount = clientCount + Number(dato.slice(21, 42).trim().replace(/^0+/, ''));
        } else if (subAccountRecordTypeColumn === '0101020') {
          clientCount = clientCount + Number(dato.slice(21, 42).trim().replace(/^0+/, ''));
        } else if (subAccountRecordTypeColumn === '0101025') {
          clientCount = clientCount - Number(dato.slice(21, 42).trim().replace(/^0+/, ''));
        } else if (subAccountRecordTypeColumn === '0101030') {
          if ( clientCount == Number(dato.slice(21, 42).trim().replace(/^0+/, ''))) {
            countArray.push({ value: clientCount, fund: ` ${fund.trim()}` });
          } else {
            validationPassed = false;
            console.log(`Validación fallida del formato ${format} para el fondo: ${fund}. 
              Sumatoria -> ${clientCount} ${subAccountRecordTypeColumn} -> F22:`, Number(dato.slice(21, 42).trim().replace(/^0+/, '')),
            );
            countArray.push({ value: Number(dato.slice(21, 42).trim().replace(/^0+/, '')), fund: ` ${fund.trim()}` });
          }
        }
      }
    });

    file.map((obj) => {
      const dato = obj.dato; 
      recordType = String(dato).substring(8, 9);
      format = String(dato).substring(9, 12);
      subAccountRecordTypeColumn = dato.slice(12, 19);

      if (recordType === '2') {
        fund = String(dato).substring(18, 24);
        format = String(dato).substring(9, 12);
        clientCount = 0;
      }
      if (recordType === '4' && format === '193') {
        if (subAccountRecordTypeColumn === '1501999') {
          clientCount =
            clientCount + Number(dato.slice(21, 42).trim().replace(/^0+/, ''));
          countArray.map((countObj) => {
            if (countObj.fund.trim() == fund.trim()) {
              clientCount == countObj.value
                ? ""
                : console.log(`Se presentan diferencias en el total del F193: ${clientCount} y el total F201: ${countObj.value} en el fondo ${fund.trim()}`, validationPassed == false);
            }
          });
        }
        clientCount = 0;
      }
    }
  );

    if (!validationPassed) {
      console.log('Validation errors were found during the F22 processing.');
      return `There were validation errors for F22. Please check the logs for details.`;
    } else {
      console.log('Validation process completed successfully for F22.');
      return `Validation proccess is OK for F22`;
    }
    
  }
}
