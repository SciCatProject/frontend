import { Component } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { map } from "rxjs/operators";

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"]
})
export class PublishComponent {
  private datasetCount$ = this.store.pipe(
    select(getDatasetsInBatch),
    map(datasets => datasets.length)
  );

  constructor(private store: Store<any>) {}
}
