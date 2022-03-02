import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { PublishedData } from "shared/sdk";
import { Router } from "@angular/router";
import { selectPublishedDataDashboardPageViewModel } from "state-management/selectors/published-data.selectors";
import {
  fetchAllPublishedDataAction,
  changePageAction,
  sortByColumnAction,
} from "state-management/actions/published-data.actions";
import {
  PageChangeEvent,
  TableColumn,
  SortChangeEvent,
  CheckboxEvent,
} from "shared/modules/table/table.component";
import { Subscription } from "rxjs";

import { MatCheckboxChange } from "@angular/material/checkbox";
import { DOCUMENT } from "@angular/common";
import { take } from "rxjs/operators";
import { Message, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";

@Component({
  selector: "app-publisheddata-dashboard",
  templateUrl: "./publisheddata-dashboard.component.html",
  styleUrls: ["./publisheddata-dashboard.component.scss"],
})
export class PublisheddataDashboardComponent implements OnInit, OnDestroy {
  public vm$ = this.store.select(selectPublishedDataDashboardPageViewModel);

  columns: TableColumn[] = [
    { name: "doi", icon: "fingerprint", sort: true, inList: false },
    { name: "title", icon: "description", sort: true, inList: true },
    { name: "creator", icon: "face", sort: true, inList: true },
    // { name: "publicationYear", icon: "date_range", sort: true, inList: true },
    { name: "createdBy", icon: "account_circle", sort: true, inList: true },
    {
      name: "createdAt",
      icon: "date_range",
      sort: true,
      inList: true,
      dateFormat: "yyyy-MM-dd HH:mm",
    },
  ];
  paginate = true;
  select = true;

  doiBaseUrl = "https://doi.org/";
  selectedDOIs: string[] = [];
  filtersSubscription: Subscription = new Subscription();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private store: Store
  ) {}

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
      5000
    );
    this.store.dispatch(showMessageAction({ message }));
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize })
    );
  }

  onSortChange(event: SortChangeEvent) {
    const { active: column, direction } = event;
    this.store.dispatch(sortByColumnAction({ column, direction }));
  }

  onRowClick(published: PublishedData) {
    const id = encodeURIComponent(published.doi);
    this.router.navigateByUrl("/publishedDatasets/" + id);
  }

  onSelectAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.vm$.pipe(take(1)).subscribe((vm) => {
        this.selectedDOIs = vm.publishedData.map(
          ({ doi }) => this.doiBaseUrl + encodeURIComponent(doi)
        );
      });
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
    this.store.dispatch(fetchAllPublishedDataAction());

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
