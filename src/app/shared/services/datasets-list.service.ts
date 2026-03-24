import { TableColumn } from "state-management/models";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { get as lodashGet } from "lodash-es";
import { Injectable, OnDestroy } from "@angular/core";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { DatePipe } from "@angular/common";
import { JsonHeadPipe } from "shared/pipes/json-head.pipe";
import { FormatNumberPipe } from "shared/pipes/format-number.pipe";
import {
  DatasetClass,
  Instrument,
  OutputDatasetObsoleteDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { selectInstruments } from "state-management/selectors/instruments.selectors";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

@Injectable()
export class DatasetsListService implements OnDestroy {
  private subscriptions: Subscription[] = [];
  instruments$ = this.store.select(selectInstruments);
  instruments: Instrument[] = [];
  instrumentMap: Map<string, Instrument> = new Map();

  constructor(
    private store: Store,
    private datePipe: DatePipe,
    private fileSizePipe: FileSizePipe,
    private jsonHeadPipe: JsonHeadPipe,
    private formatNumberPipe: FormatNumberPipe,
  ) {
    this.subscriptions.push(
      this.instruments$.subscribe((instruments) => {
        this.instruments = instruments;
        this.instrumentMap = new Map(
          instruments.map((instrument) => [instrument.pid, instrument]),
        );
      }),
    );
  }

  private getInstrumentName(row: OutputDatasetObsoleteDto): string {
    const instrument = this.instrumentMap.get(row.instrumentId);
    if (instrument?.name) {
      return instrument.name;
    }
    if (row.instrumentId != null) {
      return row.instrumentId === "" ? "-" : row.instrumentId;
    }
    return "-";
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // conditional to asses dataset status and assign correct icon ArchViewMode.work_in_progress
  // TODO: when these concepts stabilise, we should move the definitions to site config
  wipCondition(dataset: DatasetClass): boolean {
    if (
      !dataset.datasetlifecycle.archivable &&
      !dataset.datasetlifecycle.retrievable &&
      dataset.datasetlifecycle.archiveStatusMessage !==
        "scheduleArchiveJobFailed" &&
      dataset.datasetlifecycle.retrieveStatusMessage !==
        "scheduleRetrieveJobFailed"
    ) {
      return true;
    }
    return false;
  }

  systemErrorCondition(dataset: DatasetClass): boolean {
    if (
      (dataset.datasetlifecycle.retrievable &&
        dataset.datasetlifecycle.archivable) ||
      dataset.datasetlifecycle.archiveStatusMessage ===
        "scheduleArchiveJobFailed" ||
      dataset.datasetlifecycle.retrieveStatusMessage ===
        "scheduleRetrieveJobFailed"
    ) {
      return true;
    }
    return false;
  }

  userErrorCondition(dataset: DatasetClass): boolean {
    if (dataset.datasetlifecycle.archiveStatusMessage === "missingFilesError") {
      return true;
    }
    return false;
  }

  archivableCondition(dataset: DatasetClass): boolean {
    if (
      dataset.datasetlifecycle.archivable &&
      !dataset.datasetlifecycle.retrievable &&
      dataset.datasetlifecycle.archiveStatusMessage !== "missingFilesError"
    ) {
      return true;
    }
    return false;
  }

  retrievableCondition(dataset: DatasetClass): boolean {
    if (
      !dataset.datasetlifecycle.archivable &&
      dataset.datasetlifecycle.retrievable
    ) {
      return true;
    }
    return false;
  }

  convertSavedDatasetColumns(columns: TableColumn[]): TableField<any>[] {
    return columns
      .filter((column) => column.name !== "select")
      .map((column) => {
        const convertedColumn: TableField<any> = {
          name: column.name,
          header: column.header,
          index: column.order,
          display: column.enabled ? "visible" : "hidden",
          width: column.width,
          type: column.type,
          format: column.format,
          tooltip: column.tooltip,
        };

        // NOTE: This is how we render the custom columns if new config is used.
        if (column.type === "custom") {
          convertedColumn.customRender = (c, row) =>
            lodashGet(row, column.path || column.name);
          convertedColumn.toExport = (row) =>
            lodashGet(row, column.path || column.name);
        }

        if (column.name === "size") {
          convertedColumn.customRender = (column, row) =>
            this.fileSizePipe.transform(row[column.name]);
          convertedColumn.toExport = (row) =>
            this.fileSizePipe.transform(row[column.name]);
        }

        if (column.name === "creationTime") {
          convertedColumn.customRender = (column, row) =>
            this.datePipe.transform(row[column.name]);
          convertedColumn.toExport = (row) =>
            this.datePipe.transform(row[column.name]);
        }

        if (
          column.name === "metadata" ||
          column.name === "scientificMetadata"
        ) {
          convertedColumn.customRender = (column, row) => {
            // NOTE: Maybe here we should use the "scientificMetadata" as field name and not "metadata". This should be changed in the backend config.
            return this.jsonHeadPipe.transform(row["scientificMetadata"]);
          };
          convertedColumn.toExport = (row) => {
            return this.jsonHeadPipe.transform(row["scientificMetadata"]);
          };
        }

        if (column.name === "dataStatus") {
          convertedColumn.renderContentIcon = (column, row) => {
            if (this.wipCondition(row)) {
              return "hourglass_empty";
            } else if (this.archivableCondition(row)) {
              return "archive";
            } else if (this.retrievableCondition(row)) {
              return "archive";
            } else if (this.systemErrorCondition(row)) {
              return "error_outline";
            } else if (this.userErrorCondition(row)) {
              return "error_outline";
            }

            return "";
          };

          convertedColumn.customRender = (column, row) => {
            if (this.wipCondition(row)) {
              return "Work in progress";
            } else if (this.archivableCondition(row)) {
              return "Archivable";
            } else if (this.retrievableCondition(row)) {
              return "Retrievable";
            } else if (this.systemErrorCondition(row)) {
              return "System error";
            } else if (this.userErrorCondition(row)) {
              return "User error";
            }

            return "";
          };

          convertedColumn.toExport = (row) => {
            if (this.wipCondition(row)) {
              return "Work in progress";
            } else if (this.archivableCondition(row)) {
              return "Archivable";
            } else if (this.retrievableCondition(row)) {
              return "Retrievable";
            } else if (this.systemErrorCondition(row)) {
              return "System error";
            } else if (this.userErrorCondition(row)) {
              return "User error";
            }

            return "";
          };
        }

        if (column.name === "image") {
          convertedColumn.renderImage = true;
          convertedColumn.sort = "none";
        }

        if (column.name === "instrumentName") {
          convertedColumn.customRender = (column, row) =>
            this.getInstrumentName(row);
          convertedColumn.toExport = (row, column) =>
            this.getInstrumentName(row);
        }

        if (column.name.startsWith("scientificMetadata.")) {
          convertedColumn.customRender = (col, row) => {
            return String(
              this.formatNumberPipe.transform(lodashGet(row, col.name)),
            );
          };
          convertedColumn.toExport = (row) => {
            return String(
              this.formatNumberPipe.transform(lodashGet(row, column.name)),
            );
          };
        }

        if (column.type === "editable") {
          convertedColumn.toExport =
            convertedColumn.toExport ??
            ((row) => lodashGet(row, column.path || column.name) ?? "");
        }

        return convertedColumn;
      });
  }
}
