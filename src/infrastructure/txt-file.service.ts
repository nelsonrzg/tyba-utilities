import { Injectable } from '@nestjs/common';
import { CountTxtRecordsUseCase } from '../application/count-txt-records.usecase';
// ...existing code...

@Injectable()
export class TxtFileService {
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

    file.map((obj) => {
      const dato = obj.dato; 
      recordType = String(dato).substring(6, 7);
      format = String(dato).substring(7, 10);
      if (recordType === '2') {
        fund = String(dato).substring(16, 22).trimStart();
        format = String(dato).substring(9, 12);
        clientCount = 0;
      }
      if (recordType === '4' && format === '201') {
        subAccountRecordTypeColumn = dato.slice(10, 17);
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
          if (
            clientCount == Number(dato.slice(21, 42).trim().replace(/^0+/, ''))
          ) {
            console.log(`Validación exitosa del formato ${format} para el fondo:`,fund,);
            countArray.push({ value: clientCount, fund: ` ${fund.trim()}` });
          } else {
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
          countArray.map((countObj, index) => {
            if (countObj.fund.trim() == fund.trim()) {
              clientCount == countObj.value
                ? console.log(`El total del F193 coincide con el F201 en el fondo ${fund.trim()}`,)
                : console.log(`Se presentan diferencias en el total del F193: ${clientCount} y el total F201: ${countObj.value} en el fondo ${fund.trim()}`,);
            }
          });
        }
        clientCount = 0;
      }
    });

    return `Procesamiento completado para el formato`;
  }
}
