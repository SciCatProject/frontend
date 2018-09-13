import { Component, OnInit } from "@angular/core";
import { Dataset } from "../../shared/sdk/models";
import { select, Store } from "@ngrx/store";
import { getCurrentDataset } from "../../state-management/selectors/datasets.selectors";
import { SaveDatasetAction } from "../../state-management/actions/datasets.actions";
import { Observable } from "rxjs";

@Component({
  selector: "app-dataset-form",
  templateUrl: "./dataset-form.component.html",
  styleUrls: ["./dataset-form.component.css"]
})
export class DatasetFormComponent implements OnInit {
  dataset$: Observable<Dataset>;
  submitted = false;

  constructor(private store: Store<any>) {}

  onSubmit() {
    this.submitted = true;
    this.dataset$.subscribe(updated_dataset => {
      this.store.dispatch(new SaveDatasetAction(updated_dataset));
      console.log("gm submit", updated_dataset);
    });
  }

  ngOnInit() {
    this.dataset$ = this.store.pipe(select(getCurrentDataset));
  }
}
