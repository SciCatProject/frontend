import {
  Component,
  OnInit,
  OnDestroy
} from "@angular/core";
import {
  MatCheckboxChange,
  MatDialog,
  MatDialogConfig,
} from "@angular/material";
import { Policy } from "state-management/models";

import { select, Store } from "@ngrx/store";

import {
  ChangePageAction,
  ClearSelectionAction,
  DeselectPolicyAction,
  FetchPoliciesAction,
  SelectPolicyAction,
  SortByColumnAction,
  SubmitPolicyAction,
} from "state-management/actions/policies.actions";
import {
  getPage,
  getPolicies,
  getSelectedPolicies,
  getTotalCount,
  getEditablePolicies,
  getItemsPerPage
} from "state-management/selectors/policies.selectors";
import { EditDialogComponent } from "../edit-dialog/edit-dialog.component";

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface SortChangeEvent {
  active: keyof Policy;
  direction: "asc" | "desc" | "";
}

@Component({
  selector: "policies",
  templateUrl: "./policies.component.html",
  styleUrls: ["./policies.component.scss"]
})
export class PoliciesComponent implements OnInit, OnDestroy {
  public policies$ = this.store.pipe(select(getPolicies));
  public editablePolicies$ = this.store.pipe(select(getEditablePolicies));
  dialogConfig: MatDialogConfig;

  public pageSizeOptions: number[] = [10, 30, 1000];
  public itemsPerPage$ = this.store.pipe(select(getItemsPerPage));
  public editEnabled = true;
  public policiesPerPage = 10;
  public selectedPolicies$ = this.store.pipe(select(getSelectedPolicies));
  public currentPage$ = this.store.pipe(select(getPage));
  public policyCount$ = this.store.select(getTotalCount);
  private selectedPolicies: Policy[] = [];
  private selectedGroups: string[] = [];
  private selectedIds: string[] = [];
  private multiSelect = false;
  private policies: Policy[] = [];
  private subs: any[] = [];
  private currentMode = "readable";
  private modes = ["readable", "editable"];

  public editableDisplayedColumns: string[] = [
    "select",
    "manager",
    "ownerGroup",
    "autoArchive",
    "autoArchiveDelay",
    "tapeRedundancy",
    "archiveEmailNotification",
    "archiveEmailsToBeNotified",
    "retrieveEmailNotification",
    "retrieveEmailsToBeNotified"
  ];

  public readableDisplayedColumns: string[] = [
    "manager",
    "ownerGroup",
    "autoArchive",
    "autoArchiveDelay",
    "tapeRedundancy",
    "archiveEmailNotification",
    "archiveEmailsToBeNotified",
    "retrieveEmailNotification",
    "retrieveEmailsToBeNotified"
  ];

  constructor(
    private store: Store<Policy>,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.store.dispatch(new ClearSelectionAction());
    this.store.dispatch(new FetchPoliciesAction());

    this.policies$.subscribe(data => {
      this.policies = data as Policy[];
    });

    this.subs.push(
      this.selectedPolicies$.subscribe(data => {
        this.selectedPolicies = data as Policy[];
        this.multiSelect = this.selectedPolicies.length > 1;
        this.selectedGroups = [];
        this.selectedIds = [];
        for (const policy of data) {
          this.selectedGroups.push(policy.ownerGroup);
          this.selectedIds.push(policy.id);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onModeChange(event, mode: string): void {
    this.currentMode = mode;
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(new ChangePageAction(event.pageIndex, event.pageSize));
  }

  onSortChange(event: SortChangeEvent): void {
    const { active: column, direction } = event;
    this.store.dispatch(new SortByColumnAction(column, direction));
  }

  onSelect(policy: Policy): void {
    this.store.dispatch(new SelectPolicyAction(policy));
  }

  onDeselect(policy: Policy): void {
    this.store.dispatch(new DeselectPolicyAction(policy));
  }

  private openDialog() {
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.direction = "ltr";
    const selectedInfo = {
      selectedPolicy: this.selectedPolicies[0],
      selectedGroups: this.selectedGroups,
      multiSelect: this.multiSelect
    };
    console.log("selectedInfo: ", selectedInfo);
    this.dialogConfig.data = selectedInfo;
    const dialogRef = this.dialog.open(EditDialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe(val => this.onClose(val));
  }

  private onClose(result: any) {
    if (result) {
      if (
        result.archiveEmailsToBeNotified &&
        typeof result.archiveEmailsToBeNotified === "string"
      ) {
        result.archiveEmailsToBeNotified = Array.from(
          result.archiveEmailsToBeNotified.split(",")
        );
      }
      if (
        result.retrieveEmailsToBeNotified &&
        typeof result.retrieveEmailsToBeNotified === "string"
      ) {
        result.retrieveEmailsToBeNotified = Array.from(
          result.retrieveEmailsToBeNotified.split(",")
        );
      }
      this.store.dispatch(new SubmitPolicyAction(this.selectedGroups, result));
      this.store.dispatch(new ClearSelectionAction());
    }
  }

  private handleSelect(event: MatCheckboxChange, policy: Policy): void {
    if (event.checked) {
      this.onSelect(policy);
    } else {
      this.onDeselect(policy);
    }
  }

  private isChecked(policy): boolean {
    return !!this.selectedPolicies.find(
      selectedPolicy => selectedPolicy.id === policy.id
    );
  }

  private allAreSelected(): boolean {
    return (
      this.policies.length > 0 &&
      this.selectedPolicies.length === this.policies.length
    );
  }

  private handleSelectAll(event: MatCheckboxChange): void {
    this.policies.forEach(policy => this.handleSelect(event, policy));
  }

  private onEditClick() {
    this.openDialog();
  }
}
