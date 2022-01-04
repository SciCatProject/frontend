import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { Attachment, Dataset, Proposal, Sample } from "shared/sdk/models";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { ENTER, COMMA, SPACE } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { SampleEditComponent } from "datasets/sample-edit/sample-edit.component";
import { DialogComponent } from "shared/modules/dialog/dialog.component";
import { combineLatest, fromEvent, Observable, Subscription } from "rxjs";
import {  Store } from "@ngrx/store";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";
import { getCurrentUser, getIsAdmin, getProfile } from "state-management/selectors/user.selectors";
import { map } from "rxjs/operators";
import { addKeywordFilterAction, clearFacetsAction, updatePropertyAction } from "state-management/actions/datasets.actions";
import { Router } from "@angular/router";
import { fetchProposalAction } from "state-management/actions/proposals.actions";
import { clearLogbookAction, fetchLogbookAction } from "state-management/actions/logbooks.actions";
import { fetchSampleAction } from "state-management/actions/samples.actions";
import { getCurrentProposal } from "state-management/selectors/proposals.selectors";
import {
  DerivedDataset,
  RawDataset,
  User
} from "shared/sdk";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { EditableComponent } from "app-routing/pending-changes.guard";
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
export class DatasetDetailComponent implements OnInit, OnDestroy, EditableComponent {
  private subscriptions: Subscription[] = [];
  private _hasUnsavedChanges = false;
  userProfile$ = this.store.select((getProfile));
  isAdmin$ = this.store.select((getIsAdmin));
  accessGroups$: Observable<string[]> = this.userProfile$.pipe(
    map((profile) => (profile ? profile.accessGroups : []))
  );
  dataset: Dataset | undefined;
  datasetWithout: Partial<Dataset> | null = null;
  attachments: Attachment[] | null = null;
  proposal$ = this.store.select((getCurrentProposal));
  proposal: Proposal | undefined;
  sample: Sample | null = null;
  user: User | undefined;
  editingAllowed = false;
  editEnabled = false;
  show = false;
  readonly separatorKeyCodes: number[] = [ENTER, COMMA, SPACE];
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    public dialog: MatDialog,
    private store: Store<Dataset>,
    private router: Router,
  ) {}
  ngOnInit(){
    this.subscriptions.push(
      this.store.select((getCurrentDataset)).subscribe((dataset) => {
        this.dataset = dataset;
        if (this.dataset) {
          combineLatest([this.accessGroups$, this.isAdmin$]).subscribe(
            ([groups, isAdmin]) => {
              this.editingAllowed =
                groups.indexOf(this.dataset.ownerGroup) !== -1 || isAdmin;
            }
          );
          if ("proposalId" in this.dataset) {
            this.store.dispatch(
              fetchProposalAction({ proposalId: this.dataset["proposalId"] })
            );
            this.store.dispatch(
              fetchLogbookAction({ name: this.dataset["proposalId"] })
            );
          } else {
            this.store.dispatch(clearLogbookAction());
          }
          if ("sampleId" in this.dataset) {
            this.store.dispatch(
              fetchSampleAction({ sampleId: this.dataset["sampleId"] })
            );
          }
        }
      })
    );
    this.subscriptions.push(
      this.store.select((getCurrentProposal)).subscribe((proposal) =>{
        this.proposal = proposal;
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
      this.store.select((getCurrentUser)).subscribe((user) => {
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
          ((this.dataset as unknown) as RawDataset)[
            "principalInvestigator"
            ].toLowerCase()
        );
      }
      if (this.dataset.type === "derived") {
        return (
          this.user.email.toLowerCase() ===
          ((this.dataset as unknown) as DerivedDataset)[
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
            this.store.dispatch(updatePropertyAction({pid, property}));
          }
        }
    });
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
    if (this.dataset){
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
