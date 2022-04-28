import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  fetchInstrumentAction,
  saveCustomMetadataAction,
} from "state-management/actions/instruments.actions";
import { selectCurrentInstrument } from "state-management/selectors/instruments.selectors";

@Component({
  selector: "app-instrument-details",
  templateUrl: "./instrument-details.component.html",
  styleUrls: ["./instrument-details.component.scss"],
})
export class InstrumentDetailsComponent implements OnInit {
  instrument$ = this.store.select(selectCurrentInstrument);

  constructor(private route: ActivatedRoute, private store: Store) {}

  onSaveCustomMetadata(
    pid: string,
    customMetadata: Record<string, unknown>
  ): void {
    this.store.dispatch(saveCustomMetadataAction({ pid, customMetadata }));
  }

  ngOnInit() {
    const pid = this.route.snapshot.paramMap.get("id") ?? "";
    this.store.dispatch(fetchInstrumentAction({ pid }));
  }
}
