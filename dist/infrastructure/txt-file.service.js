"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxtFileService = void 0;
const common_1 = require("@nestjs/common");
const count_txt_records_usecase_1 = require("../application/count-txt-records.usecase");
let TxtFileService = class TxtFileService {
    countTxtRecordsUseCase;
    constructor(countTxtRecordsUseCase) {
        this.countTxtRecordsUseCase = countTxtRecordsUseCase;
    }
    async processFile(file) {
        let fund;
        let format;
        let countArray = [];
        let recordType;
        let subAccountRecordTypeColumn;
        let clientCount = 0;
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
                }
                else if (subAccountRecordTypeColumn === '0101010') {
                    clientCount = clientCount + Number(dato.slice(21, 42).trim().replace(/^0+/, ''));
                }
                else if (subAccountRecordTypeColumn === '0101015') {
                    clientCount = clientCount + Number(dato.slice(21, 42).trim().replace(/^0+/, ''));
                }
                else if (subAccountRecordTypeColumn === '0101020') {
                    clientCount = clientCount + Number(dato.slice(21, 42).trim().replace(/^0+/, ''));
                }
                else if (subAccountRecordTypeColumn === '0101025') {
                    clientCount = clientCount - Number(dato.slice(21, 42).trim().replace(/^0+/, ''));
                }
                else if (subAccountRecordTypeColumn === '0101030') {
                    if (clientCount == Number(dato.slice(21, 42).trim().replace(/^0+/, ''))) {
                        console.log(`Validación exitosa del formato ${format} para el fondo:`, fund);
                        countArray.push({ value: clientCount, fund: ` ${fund.trim()}` });
                    }
                    else {
                        console.log(`Validación fallida del formato ${format} para el fondo: ${fund}. 
              Sumatoria -> ${clientCount} ${subAccountRecordTypeColumn} -> F22:`, Number(dato.slice(21, 42).trim().replace(/^0+/, '')));
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
                                ? console.log(`El total del F193 coincide con el F201 en el fondo ${fund.trim()}`)
                                : console.log(`Se presentan diferencias en el total del F193: ${clientCount} y el total F201: ${countObj.value} en el fondo ${fund.trim()}`);
                        }
                    });
                }
                clientCount = 0;
            }
        });
        return `Procesamiento completado para el formato`;
    }
};
exports.TxtFileService = TxtFileService;
exports.TxtFileService = TxtFileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [count_txt_records_usecase_1.CountTxtRecordsUseCase])
], TxtFileService);
//# sourceMappingURL=txt-file.service.js.map