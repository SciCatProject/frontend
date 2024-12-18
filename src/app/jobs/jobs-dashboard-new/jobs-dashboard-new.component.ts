import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from "@angular/core";
import { SciCatDataSource } from "../../shared/services/scicat.datasource";
import { ScicatDataService } from "../../shared/services/scicat-data-service";
import { ExportExcelService } from "../../shared/services/export-excel.service";
import { Column } from "shared/modules/shared-table/shared-table.module";
import { AppConfigService } from "app-config.service";
import { JobsTableData } from "jobs/jobs-dashboard/jobs-dashboard.component";

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
      canSort: true,
      matchMode: "is",
      hideOrder: 2,
    },
    {
      id: "creationTime",
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
    private appConfigService: AppConfigService,
    private cdRef: ChangeDetectorRef,
    private dataService: ScicatDataService,
    private exportService: ExportExcelService,
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

  onRowClick(job: JobsTableData) {
    // currently deactivated, no extra data available
    /*     console.log("Row clicked:", job);
    const id = encodeURIComponent(job.id);
    this.router.navigateByUrl("/user/jobs/" + id); */
  }
}
