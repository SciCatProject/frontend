import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Instrument } from "shared/sdk";
import {
  fetchInstrumentAction,
  saveCustomMetadataAction
} from "state-management/actions/instruments.actions";
import { getCurrentInstrument } from "state-management/selectors/instruments.selectors";

@Component({
  selector: "app-instrument-details",
  templateUrl: "./instrument-details.component.html",
  styleUrls: ["./instrument-details.component.scss"]
})
export class InstrumentDetailsComponent implements OnInit {
  instrument$ = this.store.pipe(select(getCurrentInstrument));

  constructor(
    private route: ActivatedRoute,
    private store: Store<Instrument>
  ) {}

  onSaveCustomMetadata(pid: string, customMetadata: object): void {
    this.store.dispatch(saveCustomMetadataAction({ pid, customMetadata }));
  }

  ngOnInit() {
    const pid = this.route.snapshot.paramMap.get("id");
    this.store.dispatch(fetchInstrumentAction({ pid }));
  }
}
