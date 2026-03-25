"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var ExcelPdfService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelPdfService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const PDFDocument = require("pdfkit");
const ExcelJS = __importStar(require("exceljs"));
let ExcelPdfService = ExcelPdfService_1 = class ExcelPdfService {
    logger = new common_1.Logger(ExcelPdfService_1.name);
    async generatePdfFromExcel(file) {
        if (!file) {
            throw new Error('Se requiere archivo Excel');
        }
        const workbook = new ExcelJS.Workbook();
        const inputBuffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
        await workbook.xlsx.load(inputBuffer);
        const worksheet = workbook.getWorksheet('Sin Plan') || workbook.worksheets[0];
        if (!worksheet) {
            throw new Error('El archivo Excel no tiene hojas válidas');
        }
        const rows = [];
        const headers = worksheet.getRow(1).values;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1)
                return;
            const rowData = {};
            headers.forEach((header, idx) => {
                if (!header)
                    return;
                const cellValue = row.getCell(idx).value;
                rowData[String(header).trim()] = cellValue;
            });
            rows.push(rowData);
        });
        if (rows.length === 0) {
            throw new Error('No hay registros en la hoja de Excel');
        }
        const outputDir = path.resolve('C:/temp/tyba-pdf-output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const selectedColumns = [
            'Saldo Inicial al 2025',
            'Total Aportes efectuados durante el año 2025',
            'Aportes sin retención contingente',
            'Aportes con retención contingente',
            'Aportes por traslados de otros fondos',
            'Aportes anulados y/o devueltos al patrocinador',
            'Rendimiento abonado durante el año 2025',
            'Rendimientos anulados durante el año 2025',
            'Total retiros efectuados durante el año 2025',
            'Total retiros gravados',
            'Capital gravado',
            'Rendimientos Gravados',
            'Total Retiros no gravados',
            'Capital no gravado',
            'Rendimientos no gravados',
            'Total traslados a otros fondos',
            'Capital otros retiros',
            'Rendimientos Traslados a otros fondos',
            'Pagos de pensión efectuados durante la vigencia',
            'Retención en la fuente sobre rendimientos retirados',
            'Retención contingente sobre el capital retirado',
            'Saldo Final a 2025',
        ];
        const sanitizeFileName = (name) => {
            return name
                .trim()
                .replace(/[^a-zA-Z0-9 _-]/g, '_')
                .replace(/[\s]+/g, '_')
                .substring(0, 150);
        };
        const formatNit = (value) => {
            if (value === null || value === undefined || value === '') {
                return '';
            }
            let nitValue = typeof value === 'object' && value?.text ? String(value.text) : String(value);
            nitValue = nitValue.trim();
            const digitos = nitValue.replace(/\D/g, '');
            if (digitos.length === 0) {
                return nitValue;
            }
            return digitos.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " ";
        };
        const outputPaths = [];
        const headerImagePath = 'C:/temp/images/header.png';
        const footerImagePath = 'C:/temp/images/footer.png';
        const leftMarginImagePath = 'C:/temp/images/left.png';
        const rightMarginImagePath = 'C:/temp/images/right.png';
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            const encargoValue = row['Encargo'] ?? row['encargo'] ?? `registro-${index + 1}`;
            const encargoText = typeof encargoValue === 'object' && encargoValue?.text ? encargoValue.text : String(encargoValue ?? `registro-${index + 1}`);
            const safeName = sanitizeFileName(encargoText || `registro-${index + 1}`);
            const outputPath = path.join(outputDir, `${safeName || `registro-${index + 1}`}.pdf`);
            const nitPassword = row['Nit'].toString() + ", " || 'N/A';
            const nitString = String(nitPassword).replace(/[^0-9]/g, '') + " ";
            const pdfPassword = nitString.substring(0, 4);
            const doc = new PDFDocument({ size: 'A4', margin: 40, autoFirstPage: false, userPassword: pdfPassword, ownerPassword: pdfPassword });
            const writeStream = fs.createWriteStream(outputPath);
            doc.pipe(writeStream);
            doc.addPage({ size: 'A4', margin: 40 });
            if (fs.existsSync(headerImagePath)) {
                doc.image(headerImagePath, 20, 20, { width: 230 });
            }
            if (fs.existsSync(footerImagePath)) {
                doc.image(footerImagePath, 48, 760, { width: 500 });
            }
            if (fs.existsSync(leftMarginImagePath)) {
                doc.image(leftMarginImagePath, 10, 350, { width: 20, height: 75 });
            }
            if (fs.existsSync(rightMarginImagePath)) {
                doc.image(rightMarginImagePath, 560, 350, { width: 20, height: 75 });
            }
            const fondo = 'FONDO VOLUNTARIO DE PENSIONES DE JUBILACIONES E INVALIDEZ CREDICORP';
            doc.moveDown(3).fontSize(10).font('Helvetica-Bold').text(`${fondo}`, { align: 'center' });
            doc.moveDown(1).fontSize(10).font('Helvetica-Bold').text(`NIT 900.625.483-1`, { align: 'center' });
            doc.moveDown(1).fontSize(10).font('Helvetica-Bold').text(`CERTIFICADO DE RENTENCIÓN EN LA FUENTE`, { align: 'center' });
            doc.moveDown(1).fontSize(10).font('Helvetica-Bold').text(`AÑO GRAVABLE 2025`, { align: 'center' });
            doc.moveDown(1).font('Helvetica-Bold').fontSize(10).text(`Credicorp Capital Fiducairia S.A. `, { continued: true });
            doc.font('Helvetica').fontSize(10).text(`con NIT 900.520.484-7 en su calidad de Adminitradora del `, { continued: true });
            doc.font('Helvetica-Bold').fontSize(10).text(fondo, { continued: true });
            doc.font('Helvetica').fontSize(10).text(` con NIT 900.625.483-1.`);
            doc.moveDown(2).fontSize(10).font('Helvetica-Bold').text(`CERTIFICA QUE:`, { align: 'center' });
            const clienteNombre = row['Nombre cliente'] || 'N/A';
            const nit = formatNit(row['Nit']) || 'N/A';
            const encargo = row['Encargo'] || 'N/A';
            doc.moveDown(2).fontSize(10).font('Helvetica').text('El señor(a) ', { continued: true, align: 'justify' });
            doc.font('Helvetica-Bold').text(clienteNombre, { continued: true, align: 'justify' });
            doc.font('Helvetica').text(` identificado con la cédula de ciudadanía `, { continued: true, align: 'justify' });
            doc.font('Helvetica-Bold').text(nit, { continued: true, align: 'justify' });
            doc.font('Helvetica').text(`se encuentra afiliado(a) al fondo mediante el plan `, { continued: true, align: 'justify' });
            doc.font('Helvetica-Bold').text(encargo, { continued: true, align: 'justify' });
            doc.font('Helvetica').text(`, el cual presentó la siguiente información en el año 2025.`, { align: 'justify' });
            const tableTotalWidth = 510;
            const tableLeft = 40 + (doc.page.width - 80 - tableTotalWidth) / 2;
            const tableCol1Width = tableTotalWidth / 2;
            const tableCol2Width = tableTotalWidth / 2;
            const tableRowHeight = 12;
            const tableHeaderHeight = 18;
            let tableY = doc.y + 20;
            const drawCell = (x, y, width, height) => {
                doc.rect(x, y, width, height).lineWidth(1).stroke('#000000');
            };
            doc.font('Helvetica-Bold').fontSize(8).fillColor('black');
            drawCell(tableLeft, tableY, tableCol1Width, tableHeaderHeight);
            drawCell(tableLeft + tableCol1Width, tableY, tableCol2Width, tableHeaderHeight);
            doc.text('Detalle', tableLeft, tableY + 4, { width: tableCol1Width, align: 'center' });
            doc.text('Valor', tableLeft + tableCol1Width, tableY + 4, { width: tableCol2Width, align: 'center' });
            tableY += tableHeaderHeight;
            const formatCurrencyValue = (value) => {
                if (value === null || value === undefined || value === '') {
                    return '';
                }
                if (typeof value === 'object') {
                    if (value?.text) {
                        value = String(value.text);
                    }
                    else if (value instanceof Date) {
                        value = value.toLocaleDateString('es-CO');
                    }
                    else if (value?.result !== undefined) {
                        value = String(value.result);
                    }
                    else {
                        value = String(value);
                    }
                }
                if (typeof value === 'number') {
                    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }).format(value);
                }
                const raw = String(value).trim();
                const numericText = raw.replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(/,/g, '.');
                const numericValue = Number(numericText);
                if (!isNaN(numericValue) && isFinite(numericValue)) {
                    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 }).format(numericValue);
                }
                return raw;
            };
            doc.font('Helvetica').fontSize(8);
            selectedColumns.forEach((col) => {
                const rawValue = row[col] ?? '';
                const displayValue = typeof rawValue === 'object' && rawValue?.text ? rawValue.text : rawValue;
                const formattedValue = formatCurrencyValue(displayValue);
                if (tableY + tableRowHeight > 760) {
                    doc.addPage({ size: 'A4', margin: 40 });
                    tableY = 80;
                }
                drawCell(tableLeft, tableY, tableCol1Width, tableRowHeight);
                drawCell(tableLeft + tableCol1Width, tableY, tableCol2Width, tableRowHeight);
                const leftPadding = (col === 'Aportes sin retención contingente' ||
                    col === 'Aportes con retención contingente' ||
                    col === 'Aportes por traslados de otros fondos' ||
                    col === 'Aportes anulados y/o devueltos al patrocinador' ||
                    col === 'Capital gravado' ||
                    col === 'Rendimientos Gravados' ||
                    col === 'Capital no gravado' ||
                    col === 'Rendimientos no gravados' ||
                    col === 'Capital otros retiros' ||
                    col === 'Rendimientos traslados a otros fondos') ? 15 : 6;
                const isBoldColumn = (col === 'Total retiros gravados' || col === 'Total Retiros no gravados' || col === 'Total traslados a otros fondos');
                if (isBoldColumn) {
                    doc.font('Helvetica-Bold');
                }
                doc.text(col, tableLeft + leftPadding, tableY + 2, { width: tableCol1Width - 12, align: 'left' });
                if (isBoldColumn) {
                    doc.font('Helvetica');
                }
                doc.text(formattedValue, tableLeft + tableCol1Width + 6, tableY + 3, {
                    width: tableCol2Width - 12,
                    align: 'right',
                    ellipsis: true,
                });
                tableY += tableRowHeight;
            });
            if (fs.existsSync(rightMarginImagePath)) {
                doc.image(rightMarginImagePath, 545, tableY + 292, { width: 20, height: 75 });
            }
            doc.y = tableY + 10;
            doc.fontSize(10).text('(1) El valor de los rendimientos causados en el año y no retirados no son considerados ingresos tributarios.', 40, doc.y, { width: 515, align: 'left' });
            doc.fontSize(10).text('(2) Las retenciones incluidas en el presente certificado fueron declaradas y pagadas por la fiduciaria en la ciudad de Bogotá.', 40, doc.y, { width: 515, align: 'left' });
            doc.moveDown(1).fontSize(10).font('Helvetica').text('La presente certificación se expide en Bogotá D.C., marzo de 2026.', { align: 'justify' });
            doc.moveDown(2).fontSize(10).font('Helvetica-Bold').text('De acuerdo con el Art. 1.6.1.12.12 del Decreto Único Reglamentario 1625 del 2016 los certificados expedidos por computador no requieren Firma Autógrafa.', { align: 'center' });
            doc.end();
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
            outputPaths.push(outputPath);
            this.logger.log(`PDF generado: ${outputPath}`);
        }
        return { outputPaths };
    }
};
exports.ExcelPdfService = ExcelPdfService;
exports.ExcelPdfService = ExcelPdfService = ExcelPdfService_1 = __decorate([
    (0, common_1.Injectable)()
], ExcelPdfService);
//# sourceMappingURL=excel-pdf.service.js.map