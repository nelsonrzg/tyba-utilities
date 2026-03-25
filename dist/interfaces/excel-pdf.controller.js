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
exports.ExcelPdfController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const excel_pdf_service_1 = require("../infrastructure/excel-pdf.service");
let ExcelPdfController = class ExcelPdfController {
    excelPdfService;
    constructor(excelPdfService) {
        this.excelPdfService = excelPdfService;
    }
    async uploadAndGeneratePdf(file) {
        if (!file) {
            throw new common_1.HttpException('No file uploaded', common_1.HttpStatus.BAD_REQUEST);
        }
        const fileName = file.originalname || '';
        if (!fileName.toLowerCase().endsWith('.xlsx') && !fileName.toLowerCase().endsWith('.xls')) {
            throw new common_1.HttpException('El archivo debe ser un Excel (.xlsx o .xls)', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.excelPdfService.generatePdfFromExcel(file);
            return {
                message: 'PDF(s) generado(s) exitosamente',
                outputPaths: result.outputPaths,
            };
        }
        catch (error) {
            throw new common_1.HttpException(`Error generando PDF: ${error.message ?? error}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ExcelPdfController = ExcelPdfController;
__decorate([
    (0, common_1.Post)('upload-to-pdf'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExcelPdfController.prototype, "uploadAndGeneratePdf", null);
exports.ExcelPdfController = ExcelPdfController = __decorate([
    (0, common_1.Controller)('excel'),
    __metadata("design:paramtypes", [excel_pdf_service_1.ExcelPdfService])
], ExcelPdfController);
//# sourceMappingURL=excel-pdf.controller.js.map