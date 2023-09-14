import { Injectable } from "@angular/core";
import fs from "file-saver";
import { Workbook } from "exceljs";
import { Router } from "@angular/router";

export interface ExcelData {
  title: string;
  headers: unknown;
  footerText: string;
  sheetTitle: string;
  data: unknown[];
}

@Injectable({
  providedIn: "root",
})
export class ExportExcelService {
  constructor(private router: Router) {}

  exportExcel(excelData: ExcelData) {
    // Title, Header & Data
    const title = excelData.title;
    const parsedUrl = new URL(window.location.href);
    const baseUrl = parsedUrl.origin;
    const url = baseUrl + this.router.url;
    const header = excelData.headers;
    // const data = excelData.data;
    const footerText = excelData.footerText;
    const sheetTitle = excelData.sheetTitle;

    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(sheetTitle);

    // Add Row and formatting
    worksheet.mergeCells("C1", "H4");
    const titleRow = worksheet.getCell("C1");
    titleRow.value = title;
    titleRow.font = {
      name: "Calibri",
      size: 16,
      underline: "single",
      bold: true,
      color: { argb: "0085A3" },
    };
    titleRow.alignment = { vertical: "middle", horizontal: "center" };

    // Date
    worksheet.mergeCells("I1:J4");
    const date = new Date();
    const formattedDate =
      date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
    const dateCell = worksheet.getCell("I1");
    dateCell.value = formattedDate;
    dateCell.font = {
      name: "Calibri",
      size: 12,
      bold: true,
    };
    dateCell.alignment = { vertical: "middle", horizontal: "center" };

    // Add Image
    /*     const myLogoImage = workbook.addImage({
          base64: logo.imgBase64,
          extension: "png",
        });
        worksheet.mergeCells("A1:B4");
        worksheet.addImage(myLogoImage, "A1:B4"); */

    // URL
    worksheet.mergeCells("C5", "H6");
    const urlRow = worksheet.getCell("C5");
    urlRow.value = url;
    urlRow.font = {
      name: "Calibri",
      size: 10,
      underline: "single",
      bold: false,
      color: { argb: "0085A3" },
    };
    urlRow.alignment = { vertical: "middle", horizontal: "center" };

    // Blank Row
    worksheet.addRow([]);

    // Adding Header Row
    const headerRow = worksheet.addRow(header);
    let icol = 0;
    headerRow.eachCell((cell, number) => {
      // define some default column width
      icol++;
      worksheet.getColumn(icol).width = 25;

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4167B8" },
        bgColor: { argb: "" },
      };
      cell.font = {
        bold: true,
        color: { argb: "FFFFFF" },
        size: 12,
      };
    });

    // Adding Data
    excelData.data.forEach((d) => {
      worksheet.addRow(d);

      // with Conditional Formatting
      //   let sales = row.getCell(6);
      //   let color = "FF99FF99";
      //   if (+sales.value < 200000) {
      //     color = "FF9999";
      //   }

      //   sales.fill = {
      //     type: "pattern",
      //     pattern: "solid",
      //     fgColor: { argb: color },
      //   };
    });

    worksheet.addRow([]);

    // Footer Row
    const footerRow = worksheet.addRow([footerText]);
    footerRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFB050" },
    };

    // Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((writeData) => {
      const blob = new Blob([writeData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fs.saveAs(blob, title + ".xlsx");
    });
  }
}
