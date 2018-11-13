import { Component, OnInit } from "@angular/core";
import { FetchSamplesAction } from "../../state-management/actions/samples.actions";
import { Store } from "@ngrx/store";
import { Sample } from "../../shared/sdk/models";

@Component({
  selector: "app-sample-table",
  templateUrl: "./sample-table.component.html",
  styleUrls: ["./sample-table.component.css"]
})
export class SampleTableComponent implements OnInit {
  constructor(private store: Store<Sample>) {
  }

  ngOnInit() {
    this.store.dispatch(new FetchSamplesAction());
  }
}
