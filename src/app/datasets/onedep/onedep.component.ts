import { Component, OnInit, ViewChild } from "@angular/core";
import { AppConfigService, HelpMessages } from "app-config.service";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { Dataset } from "shared/sdk/models";
import {
  selectCurrentAttachments,
  selectCurrentDataset,
  selectCurrentDatasetWithoutFileInfo,
} from "state-management/selectors/datasets.selectors";

import {
  selectCurrentUser,
  selectIsAdmin,
  selectIsLoading,
  selectProfile,
} from "state-management/selectors/user.selectors";

import { combineLatest, fromEvent, Observable, Subscription } from "rxjs";

import { map } from "rxjs/operators";

@Component({
  selector: 'onedep',
  templateUrl: './onedep.component.html',
  styleUrls: ['./onedep.component.scss']
})
export class OneDepComponent implements OnInit {

  appConfig = this.appConfigService.getConfig();
  facility: string | null = null;
  ingestManual: string | null = null;
  gettingStarted: string | null = null;
  shoppingCartEnabled = false;
  helpMessages: HelpMessages;
  editingAllowed = false;
  editEnabled = false;

  dataset: Dataset | undefined;
  form: FormGroup;
  attachments$ = this.store.select(selectCurrentAttachments);
  datasetWithout$ = this.store.select(selectCurrentDatasetWithoutFileInfo);
  userProfile$ = this.store.select(selectProfile);
  isAdmin$ = this.store.select(selectIsAdmin);
  accessGroups$: Observable<string[]> = this.userProfile$.pipe(
    map((profile) => (profile ? profile.accessGroups : [])),
  );
  private subscriptions: Subscription[] = [];

  constructor(public appConfigService: AppConfigService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private fb: FormBuilder) { }

  
    ngOnInit() {
      this.form = this.fb.group({
        datasetName: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        keywords: this.fb.array([]),
      });
  
      this.subscriptions.push(
        this.store.select(selectCurrentDataset).subscribe((dataset) => {
          this.dataset = dataset;
          console.log(dataset);
          if (this.dataset) {
            combineLatest([this.accessGroups$, this.isAdmin$]).subscribe(
              ([groups, isAdmin]) => {
                this.editingAllowed =
                  groups.indexOf(this.dataset.ownerGroup) !== -1 || isAdmin;
              },
            );
          }
        }),
      );
    }
  
}