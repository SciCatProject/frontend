import { Component, OnInit } from "@angular/core";
import { Sample } from "../../shared/sdk/models";
import { select, Store } from "@ngrx/store";
import { getCurrentSample } from "../../state-management/selectors/samples.selectors";
import { ActivatedRoute } from "@angular/router";
import { FetchSampleAction } from "../../state-management/actions/samples.actions";
import { SampleService } from "../../samples/sample.service";

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.css"]
})
export class SampleDetailComponent implements OnInit {
  public sample$ = this.store.pipe(select(getCurrentSample));
  public sample: Sample;
  private subscriptions = [];

  constructor(
    private route: ActivatedRoute,
    private sampleService: SampleService,
    private store: Store<Sample>
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new FetchSampleAction("string"));
    /*
    this.subscriptions.push(
      this.store.pipe(select(getCurrentSample)).subscribe(sample => {
        if (sample && Object.keys(sample).length > 0) {
          this.sample = <Sample>sample;
          console.log(sample);
        } else {
          console.log("Searching from URL params");
          this.route.params.subscribe(params => {
          });
        }
      })
    );
    */

    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.sampleService.getSample(params.id).subscribe(sample => {
          this.sample = <Sample>sample;
          console.log(sample);
        });
      })
    );
  }
}
