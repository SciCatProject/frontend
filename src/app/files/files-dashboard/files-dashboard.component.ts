import { Component, OnDestroy, OnInit } from "@angular/core";
import { Column } from "../../shared/column.type";
import { SciCatDataSource } from "../../shared/services/scicat.datasource";
import { ScicatDataService } from "../../shared/services/scicat-data-service";
import { ExportExcelService } from "../../shared/services/export-excel.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-files-dashboard",
  templateUrl: "./files-dashboard.component.html",
  styleUrls: ["./files-dashboard.component.css"],
})
export class FilesDashboardComponent implements OnInit, OnDestroy {
  columns: Column[] = [
    {
      id: "dataFileList.path",
      icon: "text_snippet",
      label: "Filename",
      canSort: true,
      matchMode: "contains",
      hideOrder: 1,
    },
    {
      id: "dataFileList.size",
      icon: "save",
      label: "Size",
      canSort: true,
      matchMode: "greaterThan",
      hideOrder: 2,
    },
    {
      id: "dataFileList.time",
      icon: "access_time",
      label: "Created at",
      format: "date medium",
      canSort: true,
      matchMode: "after",
      hideOrder: 3,
    },
    {
      id: "dataFileList.uid",
      icon: "person",
      label: "UID",
      canSort: true,
      matchMode: "contains",
      hideOrder: 4,
    },
    {
      id: "dataFileList.gid",
      icon: "group",
      label: "GID",
      canSort: true,
      matchMode: "contains",
      hideOrder: 5,
    },
    {
      id: "ownerGroup",
      icon: "group",
      label: "Owner Group",
      canSort: true,
      matchMode: "contains",
      hideOrder: 6,
    },
    {
      id: "datasetId",
      icon: "list",
      label: "Dataset PID",
      type: "dataseturl",
      canSort: true,
      matchMode: "contains",
      hideOrder: 7,
    },
  ];

  tableDefinition = {
    collection: "Origdatablocks",
    columns: this.columns,
  };

  dataSource: SciCatDataSource;

  constructor(
    private dataService: ScicatDataService,
    private exportService: ExportExcelService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataSource = new SciCatDataSource(
      this.dataService,
      this.exportService,
      this.tableDefinition
    );
  }

  ngOnDestroy() {
    this.dataSource.disconnectExportData();
  }

  onRowClick(file: any) {
    console.log("Row clicked:", file);
  }
}
