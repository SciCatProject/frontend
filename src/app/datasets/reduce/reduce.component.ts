import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Dataset, DerivedDataset } from "shared/sdk/models";
import { Subscription } from "rxjs";
import {
  getCurrentDataset,
  reduceDataset,
  getReduceLoading,
  getDatasets
} from "state-management/selectors/datasets.selectors";
import {
  ReduceDatasetAction,
  FetchDatasetsAction
} from "state-management/actions/datasets.actions";
import { FormControl, Validators, FormGroup } from "@angular/forms";

@Component({
  selector: "reduce",
  templateUrl: "./reduce.component.html",
  styleUrls: ["./reduce.component.scss"],
})
export class ReduceComponent implements OnInit, OnDestroy {
  dataset: Dataset;
  datasetSubscription: Subscription;
  datasetHistory: Object[];

  datasets: Dataset[];
  datasetPids: String[];
  datasetsSubscription: Subscription;

  result: Object;
  resultSubscription: Subscription;
  resultLoading: boolean;
  resultLoadingSubscription: Subscription;

  show: boolean;
  columnsToDisplay: string[] = ["timestamp", "name", "pid", "software"];

  formGroup: FormGroup;

  actions: string[] = ["Analyze", "Reduce"];
  selectedAction = new FormControl("", [Validators.required]);

  analyzeScripts: object[] = [
    {
      value: "Analyze Option 1",
      description: "Short description of the first analyze script."
    },
    {
      value: "Analyze Option 2",
      description: "Short description of the second analyze script."
    },
    {
      value: "Analyze Option 3",
      description: "Short description of the third analyze script."
    }
  ];

  reduceScripts: object[] = [
    {
      value: "Reduce Option 1",
      description: "Short description of the first reduce script."
    },
    {
      value: "Reduce Option 2",
      description: "Short description of the second reduce script."
    },
    {
      value: "Reduce Option 3",
      description: "Short description of the third reduce script."
    }
  ];
  selectedScript = new FormControl("", [Validators.required]);

  constructor(private router: Router, private store: Store<any>) {}

  ngOnInit() {
    this.store.dispatch(new FetchDatasetsAction());

    this.datasetsSubscription = this.store
      .pipe(select(getDatasets))
      .subscribe(datasets => {
        this.datasets = datasets;
        this.datasetPids = datasets.map(dataset => {
          return dataset.pid;
        });
        this.datasetSubscription = this.store
          .pipe(select(getCurrentDataset))
          .subscribe(dataset => {
            this.dataset = dataset;
            this.datasetHistory = dataset.history.filter(entry => {
              if (entry.hasOwnProperty("derivedDataset")) {
                return this.datasetPids.includes(entry.derivedDataset.pid);
              }
            });
          });
      });

    this.resultSubscription = this.store
      .pipe(select(reduceDataset))
      .subscribe(result => {
        this.result = result;
      });

    this.resultLoadingSubscription = this.store
      .pipe(select(getReduceLoading))
      .subscribe(resultLoading => {
        this.resultLoading = resultLoading;
        this.store.dispatch(new FetchDatasetsAction());
      });
  }

  ngOnDestroy() {
    this.datasetSubscription.unsubscribe();
    this.datasetsSubscription.unsubscribe();
    this.resultSubscription.unsubscribe();
    this.resultLoadingSubscription.unsubscribe();
  }

  reduceDataset(dataset: Dataset): void {
    this.store.dispatch(new ReduceDatasetAction(dataset));
  }

  goTo(dataset: DerivedDataset): void {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }
}
