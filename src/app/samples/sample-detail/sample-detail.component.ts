import { ActivatedRoute } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Sample } from "../../shared/sdk/models";
import { getCurrentSample } from "../../state-management/selectors/samples.selectors";
import { select, Store } from "@ngrx/store";
import {
  FetchSampleAction,
  SetCurrentSample
} from "../../state-management/actions/samples.actions";

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.scss"]
})
export class SampleDetailComponent implements OnInit, OnDestroy {
  sample: Object;
  sample$ = this.store.pipe(select(getCurrentSample));
  private sampleId$: Observable<string>;
  private subscriptions = [];

  constructor(private route: ActivatedRoute, private store: Store<Sample>) {}

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(getCurrentSample)).subscribe(sample => {
        if (sample && Object.keys(sample).length > 0) {
          this.sample = <Sample>sample;
        } else {
          // console.log("Searching from URL params");
          this.route.params.subscribe(params => {
            console.log("fetching,", params.id);
            this.store.dispatch(new FetchSampleAction(params.id));
          });
        }
      })
    );
  }

  ngOnDestroy() {
    console.log("on destroy");
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
    this.store.dispatch(new SetCurrentSample(undefined));
  }
}
