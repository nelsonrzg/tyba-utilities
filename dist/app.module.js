"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const validator_file_controller_1 = require("./interfaces/validator-file.controller");
const excel_pdf_controller_1 = require("./interfaces/excel-pdf.controller");
const validator_file_service_1 = require("./infrastructure/validator-file.service");
const excel_pdf_service_1 = require("./infrastructure/excel-pdf.service");
const count_txt_records_usecase_1 = require("./application/count-txt-records.usecase");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: undefined,
            }),
        ],
        controllers: [app_controller_1.AppController, validator_file_controller_1.ValidatorFileController, excel_pdf_controller_1.ExcelPdfController],
        providers: [app_service_1.AppService, validator_file_service_1.ValidatorFileService, excel_pdf_service_1.ExcelPdfService, count_txt_records_usecase_1.CountTxtRecordsUseCase],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map