import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { Dataset, Proposal, Sample } from "shared/sdk/models";
import { ENTER, COMMA, SPACE } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { SampleEditComponent } from "datasets/sample-edit/sample-edit.component";
import { DialogComponent } from "shared/modules/dialog/dialog.component";
import { combineLatest, fromEvent, Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";
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
import { map } from "rxjs/operators";
import {
  addKeywordFilterAction,
  clearFacetsAction,
  updatePropertyAction,
} from "state-management/actions/datasets.actions";
import { Router } from "@angular/router";
import { selectCurrentProposal } from "state-management/selectors/proposals.selectors";
import { DerivedDataset, Instrument, RawDataset, User } from "shared/sdk";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { EditableComponent } from "app-routing/pending-changes.guard";
import { AppConfigService } from "app-config.service";
import { selectCurrentSample } from "state-management/selectors/samples.selectors";
import { selectCurrentInstrument } from "state-management/selectors/instruments.selectors";
/**
 * Component to show details for a data set, using the
 * form component
 * @export
 * @class DatasetDetailComponent
 */
@Component({
  selector: "dataset-detail",
  templateUrl: "./dataset-detail.component.html",
  styleUrls: ["./dataset-detail.component.scss"],
})
export class DatasetDetailComponent
  implements OnInit, OnDestroy, EditableComponent {
  private subscriptions: Subscription[] = [];
  private _hasUnsavedChanges = false;
  userProfile$ = this.store.select(selectProfile);
  isAdmin$ = this.store.select(selectIsAdmin);
  accessGroups$: Observable<string[]> = this.userProfile$.pipe(
    map((profile) => (profile ? profile.accessGroups : []))
  );

  appConfig = this.appConfigService.getConfig();

  dataset: Dataset | undefined;
  datasetWithout$ = this.store.select(selectCurrentDatasetWithoutFileInfo);
  attachments$ = this.store.select(selectCurrentAttachments);
  proposal$ = this.store.select(selectCurrentProposal);
  loading$ = this.store.select(selectIsLoading);
  instrument: Instrument | undefined;
  proposal: Proposal | undefined;
  sample: Sample | undefined;
  user: User | undefined;
  editingAllowed = false;
  editEnabled = false;
  show = false;
  readonly separatorKeyCodes: number[] = [ENTER, COMMA, SPACE];

  constructor(
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
    private store: Store,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select(selectCurrentDataset).subscribe((dataset) => {
        this.dataset = dataset;
        if (this.dataset) {
          combineLatest([this.accessGroups$, this.isAdmin$]).subscribe(
            ([groups, isAdmin]) => {
              this.editingAllowed =
                groups.indexOf(this.dataset.ownerGroup) !== -1 || isAdmin;
            }
          );
        }
      })
    );

    this.subscriptions.push(
      this.store.select(selectCurrentInstrument).subscribe((instrument) => {
        this.instrument = instrument;
      })
    );

    this.subscriptions.push(
      this.store.select(selectCurrentProposal).subscribe((proposal) => {
        this.proposal = proposal;
      })
    );

    this.subscriptions.push(
      this.store.select(selectCurrentSample).subscribe((sample) => {
        this.sample = sample;
      })
    );

    // Prevent user from reloading page if there are unsave changes
    this.subscriptions.push(
      fromEvent(window, "beforeunload").subscribe((event) => {
        if (this.hasUnsavedChanges()) {
          event.preventDefault();
        }
      })
    );

    this.subscriptions.push(
      this.store.select(selectCurrentUser).subscribe((user) => {
        if (user) {
          this.user = user;
        }
      })
    );
  }

  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }

  isPI(): boolean {
    if (this.user && this.dataset) {
      if (this.user.username === "admin") {
        return true;
      }
      if (this.dataset.type === "raw") {
        return (
          this.user.email.toLowerCase() ===
          (this.dataset as unknown as RawDataset)[
            "principalInvestigator"
          ].toLowerCase()
        );
      }
      if (this.dataset.type === "derived") {
        return (
          this.user.email.toLowerCase() ===
          (this.dataset as unknown as DerivedDataset)[
            "investigator"
          ].toLowerCase()
        );
      }
    }
    return false;
  }

  onClickKeyword(keyword: string) {
    this.store.dispatch(clearFacetsAction());
    this.store.dispatch(addKeywordFilterAction({ keyword }));
    this.router.navigateByUrl("/datasets");
  }

  onAddKeyword(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim() && this.dataset) {
      const keyword = value.trim().toLowerCase();
      if (!this.dataset.keywords) {
        const keywords: Array<string> = [];
        this.dataset.keywords = keywords;
      }
      if (this.dataset.keywords.indexOf(keyword) === -1) {
        const pid = this.dataset.pid;
        const keywords = [...this.dataset.keywords, keyword];
        const property = { keywords };
        this.store.dispatch(updatePropertyAction({ pid, property }));
      }
    }

    if (input) {
      input.value = "";
    }
  }

  onRemoveKeyword(keyword: string): void {
    if (this.dataset) {
      const index = this.dataset.keywords.indexOf(keyword);
      if (index >= 0) {
        const pid = this.dataset.pid;
        const keywords = [...this.dataset.keywords];
        keywords.splice(index, 1);
        const property = { keywords };
        this.store.dispatch(updatePropertyAction({ pid, property }));
      }
    }
  }

  onRemoveShare(share: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "auto",
      data: {
        title: `Really remove ${share}?`,
        question: `If you click 'Ok', ${share} will no longer be able to access this Dataset.`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.dataset) {
        const index = this.dataset.sharedWith.indexOf(share);
        if (index >= 0) {
          const pid = this.dataset.pid;
          const sharedWith: string[] = [...this.dataset.sharedWith];
          sharedWith.splice(index, 1);
          const property = { sharedWith };
          this.store.dispatch(updatePropertyAction({ pid, property }));
        }
      }
    });
  }

  onClickInstrument(instrumentId: string): void {
    const pid = encodeURIComponent(instrumentId);
    this.router.navigateByUrl("/instruments/" + pid);
  }

  onClickProposal(proposalId: string): void {
    const id = encodeURIComponent(proposalId);
    this.router.navigateByUrl("/proposals/" + id);
  }

  onClickSample(sampleId: string): void {
    const id = encodeURIComponent(sampleId);
    this.router.navigateByUrl("/samples/" + id);
  }

  openSampleEditDialog() {
    if (this.dataset) {
      this.dialog
        .open(SampleEditComponent, {
          width: "1000px",
          data: {
            ownerGroup: this.dataset.ownerGroup,
            sampleId: this.sample?.sampleId,
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res && this.dataset) {
            const { sample } = res;
            this.sample = sample;
            const pid = this.dataset.pid;
            const property = { sampleId: sample.sampleId };
            this.store.dispatch(updatePropertyAction({ pid, property }));
          }
        });
    }
  }

  onSlidePublic(event: MatSlideToggleChange) {
    if (this.dataset) {
      const pid = this.dataset.pid;
      const property = { isPublished: event.checked };
      this.store.dispatch(updatePropertyAction({ pid, property }));
    }
  }

  onSaveMetadata(metadata: Record<string, any>) {
    if (this.dataset) {
      const pid = this.dataset.pid;
      const property = { scientificMetadata: metadata };
      this.store.dispatch(updatePropertyAction({ pid, property }));
    }
  }

  onHasUnsavedChanges($event: boolean) {
    this._hasUnsavedChanges = $event;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
