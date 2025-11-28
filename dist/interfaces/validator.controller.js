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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const validator_file_service_1 = require("../infrastructure/validator-file.service");
const sync_1 = require("csv-parse/sync");
let ValidatorController = class ValidatorController {
    txtFileService;
    constructor(txtFileService) {
        this.txtFileService = txtFileService;
    }
    async uploadTxtFile(file) {
        if (!file) {
            console.log('No file uploaded');
            throw new common_1.HttpException(`No file uploaded`, common_1.HttpStatus.BAD_REQUEST);
        }
        const filename = file.originalname || '';
        if (!filename.toLowerCase().endsWith('.csv')) {
            console.log(`Invalid file extension: ${filename}`);
            throw new common_1.HttpException('The file must get .csv extention', common_1.HttpStatus.BAD_REQUEST);
        }
        const csvContent = await (0, sync_1.parse)(file.buffer.toString(), {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true,
        });
        if (!csvContent[0] || !csvContent[0]['dato']) {
            console.log('Missing "dato" column in CSV header');
            throw new common_1.HttpException('The CSV must contain a "dato" column in the header', common_1.HttpStatus.BAD_REQUEST);
        }
        console.log('Begin validation process for F22 csv file ' + file.originalname);
        const totalRecords = await this.txtFileService.processFile(csvContent);
        return { totalRecords };
    }
};
exports.ValidatorController = ValidatorController;
__decorate([
    (0, common_1.Post)('f22'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ValidatorController.prototype, "uploadTxtFile", null);
exports.ValidatorController = ValidatorController = __decorate([
    (0, common_1.Controller)('validator'),
    __metadata("design:paramtypes", [typeof (_a = typeof validator_file_service_1.TxtFileService !== "undefined" && validator_file_service_1.TxtFileService) === "function" ? _a : Object])
], ValidatorController);
//# sourceMappingURL=validator.controller.js.map