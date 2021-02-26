import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Dataset } from "shared/sdk/models";
import {
  getOpenwhiskResult,
  getDatasets
} from "state-management/selectors/datasets.selectors";
import {
  reduceDatasetAction,
  fetchDatasetsAction
} from "state-management/actions/datasets.actions";
import { FormControl, Validators, FormBuilder } from "@angular/forms";
import { map } from "rxjs/operators";

@Component({
  selector: "reduce",
  templateUrl: "./reduce.component.html",
  styleUrls: ["./reduce.component.scss"]
})
export class ReduceComponent implements OnInit, OnChanges {
  @Input() dataset: Dataset;

  derivedDatasets$ = this.store.pipe(
    select(getDatasets),
    map(datasets =>
      datasets
        .filter(dataset => dataset.type === "derived")
        .filter(dataset => dataset["inputDatasets"].includes(this.dataset.pid))
    )
  );

  result$ = this.store.pipe(select(getOpenwhiskResult));

  actionsForm = this.formBuilder.group({
    formArray: this.formBuilder.array([
      this.formBuilder.group({
        actionForm: new FormControl("", Validators.required)
      }),
      this.formBuilder.group({
        scriptForm: new FormControl("", Validators.required)
      })
    ])
  });

  actions: string[] = ["Analyze", "Reduce"];

  analyzeScripts: object[] = [
    {
      value: "Plot",
      description: "Create plot."
    }
  ];

  reduceScripts: object[] = [
    {
      value: "Noise Reduction",
      description: "Remove background noise."
    }
  ];

  columnsToDisplay: string[] = ["timestamp", "name", "pid", "software"];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<any>
  ) {}

  reduceDataset(dataset: Dataset): void {
    this.store.dispatch(reduceDatasetAction({ dataset }));
  }

  onRowClick(dataset: Dataset): void {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }

  get formArray() {
    return this.actionsForm.get("formArray");
  }

  get selectedAction() {
    return this.formArray.get([0]).get("actionForm");
  }

  get selectedScript() {
    return this.formArray.get([1]).get("scriptForm");
  }

  ngOnInit() {
    this.store.dispatch(fetchDatasetsAction());
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === "dataset") {
        this.dataset = changes[propName].currentValue;
        this.derivedDatasets$ = this.store.pipe(
          select(getDatasets),
          map(datasets =>
            datasets
              .filter(dataset => dataset.type === "derived")
              .filter(dataset =>
                dataset["inputDatasets"].includes(this.dataset.pid)
              )
          )
        );
      }
    }
  }
}
