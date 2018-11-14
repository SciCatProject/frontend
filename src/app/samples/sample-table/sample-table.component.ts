import { Component, OnDestroy, OnInit } from "@angular/core";
import { FetchSampleAction, FetchSamplesAction } from "../../state-management/actions/samples.actions";
import { Router } from "@angular/router";
import { Sample } from "../../shared/sdk/models";
import { getSamplesList } from "state-management/selectors/samples.selectors";
import { select, Store } from "@ngrx/store";

@Component({
  selector: "app-sample-table",
  templateUrl: "./sample-table.component.html",
  styleUrls: ["./sample-table.component.css"]
})
export class SampleTableComponent implements OnInit, OnDestroy {
  public samples$ = this.store.pipe(select(getSamplesList));
  samples: Sample[] = [];
  displayedColumns = ["samplelId", "owner", "createdAt", "description"];
  private subscriptions = [];

  constructor(
    private store: Store<Sample>,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new FetchSamplesAction());

    this.subscriptions.push(
      this.samples$.subscribe(data2 => {
        this.samples = data2;
        // console.log(data2);
      })
    );
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  onRowSelect(event, sample) {
    this.store.dispatch(new FetchSampleAction(sample));
    this.router.navigateByUrl(
      "/samples/" + encodeURIComponent(sample.samplelId)
    );
  }
}
