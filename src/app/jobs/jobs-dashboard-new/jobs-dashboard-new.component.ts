import { Component, OnDestroy, OnInit } from "@angular/core";
import { Column } from "../../shared/column.type";
import { SciCatDataSource } from "../../shared/services/scicat.datasource";
import { ScicatDataService } from "../../shared/services/scicat-data-service";
import { ExportExcelService } from "../../shared/services/export-excel.service";
import { Job } from "shared/sdk";
import { Router } from "@angular/router";

@Component({
  selector: "app-jobs-new-dashboard",
  templateUrl: "./jobs-dashboard-new.component.html",
  styleUrls: ["./jobs-dashboard-new.component.css"],
})
export class JobsDashboardNewComponent implements OnInit, OnDestroy {
  columns: Column[] = [
    {
      id: "id",
      label: "ID",
      canSort: true,
      icon: "perm_device_information",
      matchMode: "contains",
      hideOrder: 0,
    },
    {
      id: "emailJobInitiator",
      label: "Initiator",
      icon: "person",
      canSort: true,
      matchMode: "contains",
      hideOrder: 1,
    },
    {
      id: "type",
      label: "Type",
      icon: "unarchive",
      format: "uppercase",
      canSort: true,
      matchMode: "is",
      hideOrder: 2,
    },
    {
      id: "creationTime",
      icon: "schedule",
      label: "Created at",
      format: "date medium",
      canSort: true,
      matchMode: "after",
      hideOrder: 3,
    },
    {
      id: "jobParams",
      icon: "work",
      label: "Parameters",
      format: "json",
      canSort: false,
      hideOrder: 4,
    },
    {
      id: "jobStatusMessage",
      icon: "traffic",
      label: "Status",
      format: "json",
      canSort: true,
      matchMode: "contains",
      hideOrder: 5,
    },
    {
      id: "datasetList",
      icon: "list",
      label: "Datasets",
      format: "json",
      canSort: true,
      hideOrder: 6,
    },
    {
      id: "jobResultObject",
      icon: "work_outline",
      label: "Result",
      format: "json",
      canSort: true,
      hideOrder: 7,
    },
  ];

  tableDefinition = {
    collection: "Jobs",
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

  onRowClick(job: Job) {
    console.log("Row clicked:", job);
    const id = encodeURIComponent(job.id);
    this.router.navigateByUrl("/user/jobs/" + id);
  }
}
