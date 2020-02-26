import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Instrument } from "shared/sdk";
import { fetchInstrumentsAction } from "state-management/actions/instruments.actions";
import { getInstruments } from "state-management/selectors/instruments.selectors";

@Component({
  selector: "app-instruments-dashboard",
  templateUrl: "./instruments-dashboard.component.html",
  styleUrls: ["./instruments-dashboard.component.scss"]
})
export class InstrumentsDashboardComponent implements OnInit {
  instruments$ = this.store.pipe(select(getInstruments));

  constructor(private store: Store<Instrument>) {}

  ngOnInit() {
    this.store.dispatch(fetchInstrumentsAction());
  }
}
