import { Component, OnInit } from "@angular/core";
import { AppConfigService, HelpMessages } from "app-config.service";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { Dataset } from "shared/sdk/models";
import {

  selectCurrentDataset,
} from "state-management/selectors/datasets.selectors";

import { Subscription } from "rxjs";


@Component({
  selector: 'onedep',
  templateUrl: './onedep.component.html',
  styleUrls: ['./onedep.component.scss']
})
export class OneDepComponent implements OnInit {

  appConfig = this.appConfigService.getConfig();
  dataset: Dataset | undefined;
  cd$ = this.store.select(selectCurrentDataset);
  form: FormGroup;
  //attachments$ = this.store.select(selectCurrentAttachments);
  // datasetWithout$ = this.store.select(selectCurrentDatasetWithoutFileInfo);
  // userProfile$ = this.store.select(selectProfile);
  // isAdmin$ = this.store.select(selectIsAdmin);
  // accessGroups$: Observable<string[]> = this.userProfile$.pipe(
  //   map((profile) => (profile ? profile.accessGroups : [])),
  // );
  private subscriptions: Subscription[] = [];

  constructor(public appConfigService: AppConfigService,
    private store: Store,
    // private http: HttpClient,
    // private route: ActivatedRoute,
    // private router: Router,
    private fb: FormBuilder
    ) { }

  
    ngOnInit() {
      console.log('init OneDep')
      this.form = this.fb.group({
        datasetName: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        keywords: this.fb.array([]),
      });
      this.store.select(selectCurrentDataset).subscribe((dataset) => {
        this.dataset = dataset;
      });
    }
}
