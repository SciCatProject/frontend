import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { JsonSchema } from "@jsonforms/core";
import { AppConfigService, AppConfig } from "app-config.service";
import { Store, select } from "@ngrx/store";
import {
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";
import { selectCurrentUser } from "state-management/selectors/user.selectors";
import { selectEmpiarSchema } from "state-management/selectors/depositor.selectors";
import * as fromActions from "state-management/actions/depositor.actions";
import { Subscription, Observable } from "rxjs";
import * as datasetActions from "state-management/actions/datasets.actions";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-empiar",
  templateUrl: "./empiar.component.html",
  styleUrls: ["./empiar.component.scss"],
})
export class EmpiarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  config: AppConfig;
  dataset: OutputDatasetObsoleteDto | undefined;
  user: ReturnedUserDto | undefined;

  empiarSchema$: Observable<string>;
  empiarSchema: string;
  data: JsonSchema = createEmptyInstance();
  schema: JsonSchema;

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private fb: FormBuilder,
  ) {
    this.config = this.appConfigService.getConfig();
    this.form = this.fb.group({
      email: [""],
    });
  }

  ngOnInit() {
    // initialize an array for the files to be uploaded
    const pid = history.state.pid;
    this.store.dispatch(datasetActions.fetchDatasetAction({ pid }));

    this.store.select(selectCurrentDataset).subscribe((dataset) => {
      this.dataset = dataset;
    });

    this.subscriptions.push(
      this.store.select(selectCurrentUser).subscribe((user) => {
        if (user) {
          this.user = user;
        }
      }),
    );
    //  connect to the depositor in the previous step
    // this.store.dispatch(fromActions.connectToDepositor());

    this.store.dispatch(fromActions.accessEmpiarSchema());
    this.empiarSchema$ = this.store.pipe(select(selectEmpiarSchema));
    this.empiarSchema$.subscribe((schema) => {
      this.empiarSchema = schema;
    });

    const decodedSchema = atob(this.empiarSchema);
    this.schema = JSON.parse(decodedSchema);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}

function createEmptyInstance() {
  // not complete yet
  return {
    title: "",
    release_date: "",
    experiment_type: 0,
    scale: "",
    cross_references: [],
    workflows: [],
    authors: [],
    corresponding_author: {
      author_orcid: "",
      middle_name: "",
      organization: "",
      street: "",
      town_or_city: "",
      state_or_province: "",
      post_or_zip: "",
      telephone: "",
      fax: null,
      first_name: "",
      last_name: "",
      email: "",
      country: "",
    },
    principal_investigator: [],
    workflow_file: {
      path: "",
    },
    imagesets: [],
    citation: [],
  };
}
