import { Component, OnInit } from "@angular/core";
import { FetchSamplesAction } from "../../state-management/actions/samples.actions";
import { select, Store } from "@ngrx/store";
import { Sample } from "../../shared/sdk/models";
import { getSamples } from "state-management/selectors/samples.selectors";

@Component({
  selector: "app-sample-table",
  templateUrl: "./sample-table.component.html",
  styleUrls: ["./sample-table.component.css"]
})
export class SampleTableComponent implements OnInit {
  public samples$ = this.store.pipe(select(getSamples));
  private samples: Sample[] = [];

  constructor(private store: Store<Sample>) {
  }

  ngOnInit() {
    this.store.dispatch(new FetchSamplesAction());
    this.samples$.subscribe(data => {
      this.samples = data as Sample[];
    });
  }
}
