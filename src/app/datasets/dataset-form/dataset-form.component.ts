import { Component, OnInit } from "@angular/core";
import { RawDataset } from "../../shared/sdk/models";
import { select, Store } from "@ngrx/store";
import { getCurrentDataset } from "../../state-management/selectors/datasets.selectors";
import { SaveDatasetAction } from "../../state-management/actions/datasets.actions";

@Component({
  selector: "app-dataset-form",
  templateUrl: "./dataset-form.component.html",
  styleUrls: ["./dataset-form.component.css"]
})
export class DatasetFormComponent implements OnInit {
  dataset$ = this.store.pipe(select(getCurrentDataset));
  submitted = false;
  model: RawDataset;

  constructor(
    private store: Store<any>
  ) {
    this.model = new RawDataset();
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.model);
  }

  onSubmit() {
    this.submitted = true;
    this.dataset$.subscribe(updated_dataset => {
      this.store.dispatch(new SaveDatasetAction(updated_dataset));
    });
    console.log("gm submit", this.model);
  }

  ngOnInit() {
  }
}
