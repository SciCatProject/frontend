import { Component, Input, Output, EventEmitter } from "@angular/core";

import { OnInit } from "@angular/core";
import { MatCheckboxChange } from "@angular/material";
import { Policy } from "state-management/models";

import { Router, ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { ActionsSubject } from "@ngrx/store";

import {
  FetchPoliciesAction,
  SelectPolicyAction,
  DeselectPolicyAction,
  SubmitPolicyAction,
  ClearSelectionAction,
  ChangePageAction,
  SortByColumnAction
} from "state-management/actions/policies.actions";
import {
  getPolicies,
  getPolicyState,
  getSelectedPolicies,
  getPage,
} from "state-management/selectors/policies.selectors";
import { PoliciesService } from "../policies.service";
import { EditDialogComponent } from "../edit-dialog/edit-dialog.component";
import { MatDialog, MatDialogConfig } from "@angular/material";

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
  selector: "archive-settings",
  templateUrl: "./archive-settings.component.html",
  styleUrls: ["./archive-settings.component.scss"]
})
export class ArchiveSettingsComponent implements OnInit {
  private policies$ = this.store.pipe(select(getPolicies));
  private policyState$ = this.store.pipe(select(getPolicyState));
  private selectedPolicies$ = this.store.pipe(select(getSelectedPolicies));
  private currentPage$ = this.store.pipe(select(getPage));
  private selectedPolicies: Policy[] = [];
  private selectedGroups: string[] = [];
  private selectedIds: string[] = [];
  private multiSelect: boolean = false;
  private policies: Policy[] = [];
  private subscriptions: any;
  dialogConfig: MatDialogConfig;

  constructor(
    private actionsSubj: ActionsSubject,
    private store: Store<Policy>,
    private router: Router,
    private route: ActivatedRoute,
    private policiesService: PoliciesService,
    public dialog: MatDialog
  ) {}

  @Input()
  public totalNumber: number = 0;
  @Input()
  public currentPage: number = 0;

  @Input()
  public showSelect: boolean = false;

  @Input()
  public disabledColumns: string[] = [];

  @Output()
  private onClick: EventEmitter<Policy> = new EventEmitter();

  private pageSizeOptions: number[] = [30, 1000];
  private displayedColumns: string[] = [
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

  public editEnabled = true;

  ngOnInit() {
    this.store.dispatch(new ClearSelectionAction());
    this.store.dispatch(new FetchPoliciesAction());

    this.policies$.subscribe(data => {
      this.policies = data as Policy[];
    });

    this.selectedPolicies$.subscribe(data => {
      this.selectedPolicies = data as Policy[];
      this.multiSelect = this.selectedPolicies.length > 1;
      this.selectedGroups = [];
      this.selectedIds = [];
      for (let policy of data) {
        this.selectedGroups.push(policy.ownerGroup);
        this.selectedIds.push(policy.id);
      }
    });
  }

  private openDialog() {
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.panelClass;
    this.dialogConfig.direction = "rtl";
    let selectedInfo = {
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
    console.log("result: ", result);
    if (result) {
      if(result.archiveEmailsToBeNotified && typeof result.archiveEmailsToBeNotified === "string")
        result.archiveEmailsToBeNotified = Array.from(result.archiveEmailsToBeNotified.split(","));
      if(result.retrieveEmailsToBeNotified && typeof result.retrieveEmailsToBeNotified === "string")
        result.retrieveEmailsToBeNotified = Array.from(result.retrieveEmailsToBeNotified.split(","));
      var template = {id: "", ...result};
      for (var id of this.selectedIds) {
        template["id"] = id;
        this.store.dispatch(new SubmitPolicyAction(template));
      }
      this.store.dispatch(new ClearSelectionAction());
    }
  }

  private getDisplayedColumns(): string[] {
    return this.displayedColumns.filter(
      column => this.disabledColumns.indexOf(column) === -1
    );
  }

  private handleClick(policy): void {
    this.onClick.emit(policy);
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

  private onEditClick() {
    this.openDialog();
  }
}
