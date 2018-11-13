import { Component, OnInit } from "@angular/core";
import { FetchSampleAction, FetchSamplesAction } from "../../state-management/actions/samples.actions";
import { select, Store } from "@ngrx/store";
import { Sample } from "../../shared/sdk/models";
import { getSamples } from "state-management/selectors/samples.selectors";
import { SampleService } from "../../samples/sample.service";
import { Router } from "@angular/router";

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
    private router: Router,
    private sampleService: SampleService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new FetchSamplesAction());

    this.subscriptions.push(
      this.sampleService.getSamples().subscribe(
        data => {
          this.samples = data;
          console.log(data);
        }
      )
    );

    this.subscriptions.push(
      this.samples$.subscribe(
        data2 => {
          console.log(data2);
        }
      )
    );

  }

  onRowSelect(event, sample) {
    this.store.dispatch(new FetchSampleAction(sample));
    this.router.navigateByUrl("/samples/" + encodeURIComponent(sample.samplelId));
  }
}
