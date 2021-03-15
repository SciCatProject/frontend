import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Instrument } from "shared/sdk";
import {
  fetchInstrumentsAction,
  changePageAction,
  sortByColumnAction
} from "state-management/actions/instruments.actions";
import {
  getInstruments,
  getPage,
  getInstrumentsCount,
  getInstrumentsPerPage
} from "state-management/selectors/instruments.selectors";
import {
  TableColumn,
  PageChangeEvent,
  SortChangeEvent
} from "shared/modules/table/table.component";
import { map } from "rxjs/operators";
import { JsonHeadPipe } from "shared/pipes/json-head.pipe";
import { Router } from "@angular/router";

@Component({
  selector: "app-instruments-dashboard",
  templateUrl: "./instruments-dashboard.component.html",
  styleUrls: ["./instruments-dashboard.component.scss"]
})
export class InstrumentsDashboardComponent implements OnInit {
  instruments$ = this.store.pipe(
    select(getInstruments),
    map(instruments =>
      instruments.map(instrument => ({
        ...instrument,
        customMetadata: this.jsonHeadPipe.transform(instrument.customMetadata)
      }))
    )
  );
  currentPage$ = this.store.pipe(select(getPage));
  instrumentsCount$ = this.store.pipe(select(getInstrumentsCount));
  instrumentsPerPage$ = this.store.pipe(select(getInstrumentsPerPage));

  tablePaginate = true;
  tableColumns: TableColumn[] = [
    { name: "name", icon: "scanner", sort: true, inList: true },
    { name: "customMetadata", icon: "insert_chart", sort: false, inList: true }
  ];

  constructor(
    private jsonHeadPipe: JsonHeadPipe,
    private router: Router,
    private store: Store<Instrument>
  ) {}

  onPageChange(event: PageChangeEvent): void {
    const { pageIndex: page, pageSize: limit } = event;
    this.store.dispatch(changePageAction({ page, limit }));
  }

  onSortChange(event: SortChangeEvent): void {
    const { active: column, direction } = event;
    this.store.dispatch(sortByColumnAction({ column, direction }));
  }

  onRowClick(instrument: Instrument): void {
    const pid = encodeURIComponent(instrument.pid);
    this.router.navigateByUrl("/instruments/" + pid);
  }

  ngOnInit() {
    this.store.dispatch(fetchInstrumentsAction());
  }
}
