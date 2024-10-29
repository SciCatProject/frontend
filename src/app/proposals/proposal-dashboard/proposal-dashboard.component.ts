import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import { AppConfigService } from "app-config.service";
import { Column } from "shared/modules/shared-table/shared-table.module";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts";
import { ExportExcelService } from "shared/services/export-excel.service";
import { ScicatDataService } from "shared/services/scicat-data-service";
import { SciCatDataSource } from "shared/services/scicat.datasource";

@Component({
  selector: "app-proposal-dashboard",
  templateUrl: "./proposal-dashboard.component.html",
  styleUrls: ["./proposal-dashboard.component.scss"],
})
export class ProposalDashboardComponent implements OnDestroy, AfterViewChecked {
  columns: Column[] = [
    {
      id: "proposalId",
      label: "Proposal ID",
      canSort: true,
      icon: "perm_device_information",
      matchMode: "contains",
      hideOrder: 0,
    },
    {
      id: "title",
      label: "Title",
      icon: "description",
      canSort: true,
      matchMode: "contains",
      hideOrder: 1,
    },
    {
      id: "firstname",
      label: "First Name",
      icon: "badge",
      canSort: true,
      matchMode: "contains",
      hideOrder: 2,
    },
    {
      id: "lastname",
      label: "Last Name",
      icon: "badge",
      canSort: true,
      matchMode: "contains",
      hideOrder: 3,
    },
    {
      id: "startTime",
      icon: "timer",
      label: "Start Date",
      format: "date",
      canSort: true,
      matchMode: "between",
      hideOrder: 4,
      sortDefault: "desc",
    },
    {
      id: "endTime",
      icon: "timer_off",
      label: "End Date",
      format: "date",
      canSort: true,
      matchMode: "between",
      hideOrder: 5,
    },
  ];
  tableDefinition = {
    collection: "Proposals",
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
  onRowClick(proposal: ProposalClass) {
    const id = encodeURIComponent(proposal.proposalId);
    this.router.navigateByUrl("/proposals/" + id);
  }
}
