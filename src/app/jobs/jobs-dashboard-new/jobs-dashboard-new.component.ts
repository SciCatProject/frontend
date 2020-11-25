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
    //{ id: "id", label: "ID", canSort: true, matchMode: "contains", hideOrder: 0, },
    { id: "emailJobInitiator", label: "Initiator", canSort: true, matchMode: "contains", hideOrder: 1, },
    { id: "type", label: "Type", format: "uppercase", canSort: true, matchMode: "is", hideOrder: 2, },
    { id: "creationTime", label: "Created at", format: "date medium", canSort: true, matchMode: "after", hideOrder: 3, },
    { id: "jobParams", label: "Parameters", format: "json", canSort: false, hideOrder: 4, },
    { id: "jobStatusMessage", label: "Status", format: "json", canSort: true, matchMode: "contains", hideOrder: 5, },
    { id: "datasetList", label: "Datasets", format: "json", canSort: true, hideOrder: 6, },
    { id: "jobResultObject", label: "Result", format: "json", canSort: true, hideOrder: 7, },
  ]

  // TODO get the real API endpoint
  tableDefinition = {
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
