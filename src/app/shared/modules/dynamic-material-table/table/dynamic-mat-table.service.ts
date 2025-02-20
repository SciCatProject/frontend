import { Injectable } from "@angular/core";
import { TableField } from "../models/table-field.model";
import { SelectionModel } from "@angular/cdk/collections";
import { TableRow } from "../models/table-row.model";
@Injectable({
  providedIn: "root",
})
export class TableService {
  /************************************* Local Export *****************************************/
  static getFormattedTime() {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const h = today.getHours();
    const mi = today.getMinutes();
    const s = today.getSeconds();
    return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
  }

  public tableName: string;

  constructor() {}

  private downloadBlob(blob: Blob | any, filename: string) {
    if ((navigator as any).msSaveBlob) {
      // IE 10+
      (navigator as any).msSaveBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  public exportToCsv<T extends TableRow>(
    columns: TableField<T>[],
    rows: object[],
    selectionModel: SelectionModel<any>,
    filename = "",
  ) {
    const dataToExport = selectionModel.selected.length
      ? selectionModel.selected
      : rows;

    filename =
      filename === ""
        ? this.tableName + TableService.getFormattedTime() + ".csv"
        : filename;
    if (!dataToExport || !dataToExport.length) {
      return;
    }
    const fields = columns.filter(
      (c) => c.exportable !== false && c.display !== "hidden",
    );
    const separator = ",";
    const CR_LF = "\n"; //'\u0D0A';
    const keys = fields.map((f) => f.name);
    const headers = fields.map((f) => f.header);
    const csvContent =
      headers.join(separator) +
      CR_LF +
      dataToExport
        .map((row) => {
          return fields
            .map((f) => {
              let cell = f.toExport(row, "csv") || "";
              cell =
                cell instanceof Date
                  ? cell.toLocaleString()
                  : cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join(CR_LF);

    const blob = new Blob(
      [new Uint8Array([0xef, 0xbb, 0xbf]) /* UTF-8 BOM */, csvContent],
      { type: "text/csv;charset=utf-8" },
    );
    this.downloadBlob(blob, filename);
  }

  public exportToJson(
    rows: object[],
    selectionModel: SelectionModel<any>,
    filename = "",
  ) {
    const dataToExport = selectionModel.selected.length
      ? selectionModel.selected
      : rows;

    filename =
      filename === ""
        ? this.tableName + TableService.getFormattedTime() + ".json"
        : filename;
    const blob = new Blob([JSON.stringify(dataToExport)], {
      type: "text/csv;charset=utf-8;",
    });
    this.downloadBlob(blob, filename);
  }

  /************************************* Save Setting into storage *****************************************/
  public loadSavedColumnInfo(
    columnInfo: TableField<any>[],
    saveName?: string,
  ): TableField<any>[] {
    // Only load if a save name is passed in
    if (saveName) {
      if (!localStorage) {
        return null;
      }

      const loadedInfo = localStorage.getItem(`${saveName}-columns`);

      if (loadedInfo) {
        return JSON.parse(loadedInfo);
      }
      this.saveColumnInfo(columnInfo);
      return columnInfo;
    }

    return null;
  }

  public saveColumnInfo(
    columnInfo: TableField<any>[],
    saveName: string = this.tableName,
  ): void {
    if (saveName) {
      if (!localStorage) {
        return;
      }

      localStorage.setItem(`${saveName}-columns`, JSON.stringify(columnInfo));
    }
  }
}
