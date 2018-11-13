import { Component, OnInit } from "@angular/core";
import { FetchSamplesAction } from "../../state-management/actions/samples.actions";
import { select, Store } from "@ngrx/store";
import { Sample } from "../../shared/sdk/models";
import { getSamples } from "state-management/selectors/samples.selectors";
import { SampleService } from "../../samples/sample.service";
import { SampleApi } from "../../shared/sdk/services/custom";

@Component({
  selector: "app-sample-table",
  templateUrl: "./sample-table.component.html",
  styleUrls: ["./sample-table.component.css"]
})
export class SampleTableComponent implements OnInit {
  public samples$ = this.store.pipe(select(getSamples));
  samples: Sample[] = [];
  displayedColumns = ["samplelId", "owner"];
  private subscriptions = [];

  constructor(
    private store: Store<Sample>,
    private sampleApi: SampleApi,
    private sampleService: SampleService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new FetchSamplesAction());
    this.samples$.subscribe(data => {
      //  this.samples = data as Sample[];
    });

    this.subscriptions.push(
      this.sampleApi.find().subscribe(data => {
        this.samples = data as Sample[];
        console.log(data);
      })
    );
  }
}
