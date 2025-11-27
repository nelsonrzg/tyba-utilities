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
const txt_file_controller_1 = require("./interfaces/txt-file.controller");
const txt_file_service_1 = require("./infrastructure/txt-file.service");
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
        controllers: [app_controller_1.AppController, txt_file_controller_1.TxtFileController],
        providers: [app_service_1.AppService, txt_file_service_1.TxtFileService, count_txt_records_usecase_1.CountTxtRecordsUseCase],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map