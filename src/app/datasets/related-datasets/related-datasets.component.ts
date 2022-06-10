import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppConfigService } from "app-config.service";
import { Subscription } from "rxjs";
import { Column } from "shared/modules/shared-table/shared-table.module";
import { Dataset } from "shared/sdk";
import { ExportExcelService } from "shared/services/export-excel.service";
import { ScicatDataService } from "shared/services/scicat-data-service";
import { SciCatDataSource } from "shared/services/scicat.datasource";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";

@Component({
  selector: "app-related-datasets",
  templateUrl: "./related-datasets.component.html",
  styleUrls: ["./related-datasets.component.scss"],
})
export class RelatedDatasetsComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  dataset$ = this.store.select(selectCurrentDataset);
  datasetSubscription = new Subscription();
  dataset: Dataset;
  dataSource: SciCatDataSource;

  columns: Column[] = [
    {
      id: "datasetName",
      label: "Name",
      canSort: true,
      icon: "perm_device_information",
      matchMode: "contains",
      hideOrder: 0,
    },
    {
      id: "sourceFolder",
      label: "Source Folder",
      canSort: true,
      icon: "perm_device_information",
      matchMode: "contains",
      hideOrder: 1,
    },
    {
      id: "size",
      label: "Size",
      canSort: true,
      icon: "perm_device_information",
      matchMode: "contains",
      hideOrder: 2,
    },
    {
      id: "type",
      label: "Type",
      canSort: true,
      icon: "perm_device_information",
      matchMode: "contains",
      hideOrder: 3,
      filterDefault: "derived"
    },
    {
      id: "createdAt",
      label: "Creation Time",
      format: "date",
      canSort: true,
      icon: "perm_device_information",
      matchMode: "between",
      hideOrder: 4,
      sortDefault: "desc",
    },
    {
      id: "owner",
      label: "Owner",
      canSort: true,
      icon: "perm_device_information",
      matchMode: "contains",
      hideOrder: 5,
    },
  ];

  tableDefinition = {
    collection: "Datasets",
    columns: this.columns,
  };

  constructor(
    private appConfigService: AppConfigService,
    private cdRef: ChangeDetectorRef,
    private exportService: ExportExcelService,
    private dataService: ScicatDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.dataSource = new SciCatDataSource(
      this.appConfigService,
      this.dataService,
      this.exportService,
      this.tableDefinition
    );
  }

  ngOnInit(): void {
    this.datasetSubscription = this.dataset$.subscribe((dataset) => {
      this.dataset = dataset;
    });

    let url = this.router.url;
    console.log({ url });

    if (this.dataset && this.dataset.type === "raw") {
      this.router.navigate([], {
        queryParams: { fields: JSON.stringify({type: "derived"}) },
        queryParamsHandling: "merge",
      });
    }
  }

  ngOnDestroy(): void {
    this.datasetSubscription.unsubscribe();
    this.dataSource.disconnectExportData();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  onRowClick(dataset: Dataset) {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }
}
