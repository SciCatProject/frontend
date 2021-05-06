import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Column } from "shared/modules/shared-table/shared-table.module";
import { Proposal } from "shared/sdk";
import { ExportExcelService } from "shared/services/export-excel.service";
import { ScicatDataService } from "shared/services/scicat-data-service";
import { SciCatDataSource } from "shared/services/scicat.datasource";

@Component({
  selector: "app-proposal-dashboard-new",
  templateUrl: "./proposal-dashboard-new.component.html",
  styleUrls: ["./proposal-dashboard-new.component.scss"]
})
export class ProposalDashboardNewComponent implements OnInit {
  columns: Column[] = [
    { id: "proposalId", label: "ID", canSort: true, icon: "perm_contact_calendar", matchMode: "contains", hideOrder: 0, },
    { id: "title", label: "Title", icon: "fingerprint", canSort: true, matchMode: "contains", hideOrder: 1, },
    {
      id: "startTime", icon: "timer", label: "Start Date", format: "date", canSort: true,
      matchMode: "between", hideOrder: 3, sortDefault: "desc"
    },
    {
      id: "endTime", icon: "timer_off", label: "End Date", format: "date", canSort: true,
      matchMode: "between", hideOrder: 4
    },
  ];
  tableDefinition = {
    collection: "Proposals",
    columns: this.columns,
  };
  dataSource: SciCatDataSource;
  constructor(
    private cdRef: ChangeDetectorRef,
    private dataService: ScicatDataService,
    private exportService: ExportExcelService,
    private router: Router,) { }

  ngOnInit(): void {
    this.dataSource = new SciCatDataSource(
      this.dataService,
      this.exportService,
      this.tableDefinition
    );
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnDestroy() {
    this.dataSource.disconnectExportData();
  }
  onRowClick(proposal: Proposal) {
    const id = encodeURIComponent(proposal.proposalId);
    this.router.navigateByUrl("/proposals/" + id);
  }
}
