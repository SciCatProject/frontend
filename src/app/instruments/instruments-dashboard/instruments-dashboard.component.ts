import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Instrument } from "@scicatproject/scicat-sdk-ts-angular";
import {
  fetchInstrumentsAction,
  changePageAction,
  sortByColumnAction,
} from "state-management/actions/instruments.actions";
import { selectInstrumentsDashboardPageViewModel } from "state-management/selectors/instruments.selectors";
import {
  TableColumn,
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import { map } from "rxjs/operators";
import { JsonHeadPipe } from "shared/pipes/json-head.pipe";
import { Router } from "@angular/router";

@Component({
  selector: "app-instruments-dashboard",
  templateUrl: "./instruments-dashboard.component.html",
  styleUrls: ["./instruments-dashboard.component.scss"],
  standalone: false,
})
export class InstrumentsDashboardComponent implements OnInit {
  vm$ = this.store.select(selectInstrumentsDashboardPageViewModel).pipe(
    map((vm) => ({
      ...vm,
      instruments: vm.instruments.map((instrument) => ({
        ...instrument,
        customMetadata: this.jsonHeadPipe.transform(instrument.customMetadata),
      })),
    })),
  );

  tablePaginate = true;
  tableColumns: TableColumn[] = [
    { name: "uniqueName", icon: "scanner", sort: true, inList: true },
    { name: "name", icon: "fingerprint", sort: true, inList: true },
  ];

  constructor(
    private jsonHeadPipe: JsonHeadPipe,
    private router: Router,
    private store: Store,
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
