import { Injectable } from "@angular/core";
import * as fs from "file-saver";
import * as logo from "./scicatLogo";
import { Workbook } from "exceljs";

@Injectable({
  providedIn: "root",
})
export class ExportExcelService {
  constructor() {}

  exportExcel(excelData) {
    // Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    // const data = excelData.data;
    const footerText = excelData.footerText;
    const sheetTitle = excelData.sheetTitle;

    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(sheetTitle);

    // Add Row and formatting
    worksheet.mergeCells("C1", "F4");
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
    worksheet.mergeCells("G1:H4");
    const date = new Date();
    const formattedDate =
      date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
    const dateCell = worksheet.getCell("G1");
    dateCell.value = formattedDate;
    dateCell.font = {
      name: "Calibri",
      size: 12,
      bold: true,
    };
    dateCell.alignment = { vertical: "middle", horizontal: "center" };

    // Add Image
    const myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: "png",
    });
    worksheet.mergeCells("A1:B4");
    worksheet.addImage(myLogoImage, "A1:B4");

    // Blank Row
    worksheet.addRow([]);

    // Adding Header Row
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
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

    // Adding Data with Conditional Formatting
    // data.forEach((d) => {
    //   const row = worksheet.addRow(d);

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
    // });

    // worksheet.getColumn(3).width = 20;
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
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fs.saveAs(blob, title + ".xlsx");
    });
  }
}
