import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { AppConfigService, AppConfig } from "app-config.service";
import { ActivatedRoute } from "@angular/router";

import { Store } from "@ngrx/store";
import {
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";
// import {
//   selectIsAdmin,
//   selectIsLoading,
//   selectIsLoggedIn,
//   selectProfile,
// } from "state-management/selectors/user.selectors";
import { selectCurrentUser } from "state-management/selectors/user.selectors";
import * as fromActions from "state-management/actions/depositor.actions";

import { Subscription } from "rxjs";
import { Router } from "@angular/router";

interface DepositionRepository {
  value: string;
  viewValue: string;
}

@Component({
  selector: "depositor",
  templateUrl: "./depositor.component.html",
  styleUrls: ["./depositor.component.scss"],
})
export class DepositorComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  form: FormGroup;

  config: AppConfig;
  supportedDepositionList: DepositionRepository[] = [
    { value: "onedep", viewValue: "OneDep" },
    { value: "empiar", viewValue: "EMPIAR" },
  ];
  depositionRepository: FormControl;
  dataset: OutputDatasetObsoleteDto | undefined;
  user: ReturnedUserDto | undefined;
  selectedMethod: string | null = null;
  onedepLink: {
    location: string;
    enabled: boolean;
  } | null = null;

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.config = this.appConfigService.getConfig();
    this.depositionRepository = new FormControl("");
    this.form = this.fb.group({
      datasetName: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      keywords: this.fb.array([]),
    });
  }
  ngOnInit() {
    this.store.dispatch(fromActions.connectToDepositor());

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
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  onChooseRepo() {
    const id = encodeURIComponent(this.dataset.pid);
    if (this.depositionRepository.value === "onedep") {
      this.router.navigate(["/datasets", id, "onedep"], {
        state: { pid: this.dataset.pid },
      });
    } else if (this.depositionRepository.value === "empiar") {
      this.router.navigate(["/datasets", id, "empiar"], {
        state: { pid: this.dataset.pid },
      });
    }
  }
}
