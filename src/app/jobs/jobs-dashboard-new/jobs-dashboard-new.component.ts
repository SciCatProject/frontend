import { Component, OnDestroy, OnInit } from "@angular/core";
import { Column } from "../../shared/column.type";
import { SciCatDataSource } from "../../shared/services/scicat.datasource";
import { ScicatDataService } from "../../shared/services/scicat-data-service";
import { ExportExcelService } from "../../shared/services/export-excel.service";

@Component({
  selector: "app-jobs-new-dashboard",
  templateUrl: "./jobs-dashboard-new.component.html",
  styleUrls: ["./jobs-dashboard-new.component.css"]
})

export class JobsDashboardNewComponent implements OnInit, OnDestroy {

  columns: Column[] = [
    { id: "initiator", label: "Initiator", canSort: true, matchMode: "contains", hideOrder: 0, },
    { id: "type", label: "Type", canSort: true, hideOrder: 1, },
    { id: "createdAt", label: "Created At", matchMode: "contains", hideOrder: 2, },
    { id: "statusMessage", label: "Status", canSort: true, matchMode: "contains", hideOrder: 3, },
  ]

  tableDefinition = {
    api: "http://localhost:3000/api/v3/",
    collection: "Jobs",
    columns: this.columns
  }


  dataSource: SciCatDataSource;

  constructor(private dataService: ScicatDataService, private exportService: ExportExcelService) { }

  ngOnInit() {
    this.dataSource = new SciCatDataSource(this.dataService, this.exportService, this.tableDefinition);
  }

  ngOnDestroy() {
    this.dataSource.disconnectExportData()
  }
}
