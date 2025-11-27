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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxtFileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const txt_file_service_1 = require("../infrastructure/txt-file.service");
const sync_1 = require("csv-parse/sync");
let TxtFileController = class TxtFileController {
    txtFileService;
    constructor(txtFileService) {
        this.txtFileService = txtFileService;
    }
    async uploadTxtFile(file) {
        if (!file) {
            throw new common_1.HttpException('No file uploaded', common_1.HttpStatus.BAD_REQUEST);
        }
        const csvContent = await (0, sync_1.parse)(file.buffer.toString(), {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true,
        });
        const totalRecords = await this.txtFileService.processFile(csvContent);
        return { totalRecords };
    }
};
exports.TxtFileController = TxtFileController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TxtFileController.prototype, "uploadTxtFile", null);
exports.TxtFileController = TxtFileController = __decorate([
    (0, common_1.Controller)('txt'),
    __metadata("design:paramtypes", [txt_file_service_1.TxtFileService])
], TxtFileController);
//# sourceMappingURL=txt-file.controller.js.map