import { Component, OnInit } from "@angular/core";
import { Dataset, RawDataset } from "../../shared/sdk/models";
import { DatasetService } from "../dataset.service";
import { select } from "@ngrx/store";
import { getCurrentDataset } from "../../state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-dataset-form",
  templateUrl: "./dataset-form.component.html",
  styleUrls: ["./dataset-form.component.css"]
})
export class DatasetFormComponent implements OnInit {
  dataset$ = this.store.pipe(select(getCurrentDataset));
  parameter_name: string;
  parameter_value: string;
  submitted = false;
  model: RawDataset;


  constructor(
    private store: Store<any>,
    private datasetService: DatasetService
  ) {

    this.model = new RawDataset();
  }

  onSubmit() {
    this.submitted = true;
    this.datasetService.setDataset(this.model);
    console.log("gm submit", this.parameter_name);
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.model);
  }

  ngOnInit() {}
}
