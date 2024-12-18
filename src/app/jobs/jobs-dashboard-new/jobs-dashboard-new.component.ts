import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import { SciCatDataSource } from "../../shared/services/scicat.datasource";
import { ScicatDataService } from "../../shared/services/scicat-data-service";
import { ExportExcelService } from "../../shared/services/export-excel.service";
import { Column } from "shared/modules/shared-table/shared-table.module";
import { AppConfigService } from "app-config.service";
import { JobsTableData } from "jobs/jobs-dashboard/jobs-dashboard.component";
import { Job } from "shared/sdk/models/Job";

@Component({
  selector: "app-jobs-new-dashboard",
  templateUrl: "./jobs-dashboard-new.component.html",
  styleUrls: ["./jobs-dashboard-new.component.scss"],
})
export class JobsDashboardNewComponent implements OnDestroy, AfterViewChecked {
  // not needed, date by default is shown in local time and using the locale of the browser (if installed, see app.module.ts)
  // tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
      id: "createdBy",
      label: "Creator",
      icon: "person",
      canSort: true,
      matchMode: "is",
      hideOrder: 1,
    },
    {
      id: "type",
      label: "Type",
      icon: "unarchive",
      canSort: true,
      matchMode: "is",
      hideOrder: 2,
    },
    {
      id: "createdAt",
      icon: "schedule",
      label: "Created at local time",
      format: "date medium ",
      canSort: true,
      matchMode: "between",
      hideOrder: 3,
      sortDefault: "desc",
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
      id: "statusCode",
      icon: "traffic",
      label: "Status",
      canSort: true,
      matchMode: "contains",
      hideOrder: 5,
    },
    {
      id: "jobResultObject",
      icon: "work_outline",
      label: "Result",
      format: "json",
      canSort: true,
      hideOrder: 6,
    },
  ];

  tableDefinition = {
    collection: "Jobs",
    columns: this.columns,
  };

  dataSource: SciCatDataSource;

  constructor(
    private appConfigService: AppConfigService,
    private cdRef: ChangeDetectorRef,
    private dataService: ScicatDataService,
    private exportService: ExportExcelService,
    private router: Router,
  ) {
    this.dataSource = new SciCatDataSource(
      this.appConfigService,
      this.dataService,
      this.exportService,
      this.tableDefinition,
    );
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.dataSource.disconnectExportData();
  }

  onRowClick(job: Job) {
    const id = encodeURIComponent(job.id);
    this.router.navigateByUrl("/user/jobs/" + id);
  }
}
