import { Component, OnInit } from "@angular/core";
import { Sample } from "../../shared/sdk/models";
import { select, Store } from "@ngrx/store";
import { getCurrentSample } from "../../state-management/selectors/samples.selectors";
import { SampleApi } from "../../shared/sdk/services/custom";

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.css"]
})
export class SampleDetailComponent implements OnInit {
  public sample$ = this.store.pipe(select(getCurrentSample));
  constructor(
    private store: Store<Sample>
  ) {}

  ngOnInit() {
  }
}
