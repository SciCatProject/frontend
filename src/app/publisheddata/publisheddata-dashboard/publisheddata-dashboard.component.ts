import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { PublishedData } from "@scicatproject/scicat-sdk-ts";
import { Router } from "@angular/router";
import { selectPublishedDataDashboardPageViewModel } from "state-management/selectors/published-data.selectors";
import { CheckboxEvent } from "shared/modules/table/table.component";
import { Subscription } from "rxjs";

import { MatCheckboxChange } from "@angular/material/checkbox";
import { DOCUMENT } from "@angular/common";
import { Message, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";
import { Column } from "shared/modules/shared-table/shared-table.module";
import { SciCatDataSource } from "shared/services/scicat.datasource";
import { AppConfigService } from "app-config.service";
import { ScicatDataService } from "shared/services/scicat-data-service";
import { ExportExcelService } from "shared/services/export-excel.service";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-publisheddata-dashboard",
  templateUrl: "./publisheddata-dashboard.component.html",
  styleUrls: ["./publisheddata-dashboard.component.scss"],
})
export class PublisheddataDashboardComponent implements OnInit, OnDestroy {
  public vm$ = this.store.select(selectPublishedDataDashboardPageViewModel);
  columns: Column[] = [
    {
      id: "doi",
      label: "DOI",
      canSort: true,
      icon: "fingerprint",
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
      id: "creator",
      label: "Creator",
      icon: "face",
      canSort: true,
      matchMode: "contains",
      hideOrder: 2,
    },
    {
      id: "createdBy",
      icon: "account_circle",
      label: "Created by",
      canSort: true,
      matchMode: "contains",
      hideOrder: 4,
    },
    {
      id: "createdAt",
      icon: "date_range",
      label: "Created at",
      format: "date",
      canSort: true,
      matchMode: "between",
      hideOrder: 5,
    },
  ];
  tableDefinition = {
    collection: "publishedData",
    columns: this.columns,
  };
  dataSource: SciCatDataSource;
  select = true;

  doiBaseUrl = "https://doi.org/";
  selectedDOIs: string[] = [];
  filtersSubscription: Subscription = new Subscription();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private store: Store,
    private appConfigService: AppConfigService,
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

  onShareClick() {
    const selectionBox = this.document.createElement("textarea");
    selectionBox.style.position = "fixed";
    selectionBox.style.left = "0";
    selectionBox.style.top = "0";
    selectionBox.style.opacity = "0";
    selectionBox.value = this.selectedDOIs.join("\n");
    this.document.body.appendChild(selectionBox);
    selectionBox.focus();
    selectionBox.select();
    this.document.execCommand("copy");
    this.document.body.removeChild(selectionBox);

    const message = new Message(
      "The selected DOI's have been copied to your clipboard",
      MessageType.Success,
      5000,
    );
    this.store.dispatch(showMessageAction({ message }));
  }

  onRowClick(published: PublishedData) {
    const id = encodeURIComponent(published.doi);
    this.router.navigateByUrl("/publishedDatasets/" + id);
  }

  onSelectAll(event: {
    event: MatCheckboxChange;
    selection: SelectionModel<any>;
  }) {
    if (event.event.checked) {
      this.selectedDOIs = event.selection.selected.map(
        ({ doi }) => this.doiBaseUrl + encodeURIComponent(doi),
      );
    } else {
      this.selectedDOIs = [];
    }
  }

  onSelectOne(checkboxEvent: CheckboxEvent) {
    const { event, row } = checkboxEvent;
    const doiUrl = this.doiBaseUrl + encodeURIComponent(row.doi);
    if (event.checked) {
      this.selectedDOIs.push(doiUrl);
    } else {
      this.selectedDOIs.splice(this.selectedDOIs.indexOf(doiUrl), 1);
    }
  }

  ngOnInit() {
    this.filtersSubscription = this.vm$.subscribe((vm) => {
      this.router.navigate(["/publishedDatasets"], {
        queryParams: { args: JSON.stringify(vm.filters) },
      });
    });
  }

  ngOnDestroy() {
    this.filtersSubscription.unsubscribe();
  }
}
