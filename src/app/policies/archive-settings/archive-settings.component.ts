import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  MatCheckboxChange,
  MatDialog,
  MatDialogConfig,
  MatTableDataSource
} from "@angular/material";
import { Policy } from "state-management/models";

import { ActivatedRoute, Router } from "@angular/router";
import { ActionsSubject, select, Store } from "@ngrx/store";
// import { Observable } from 'rxjs/Observable';
import {
  DeselectPolicyAction,
  FetchPoliciesAction,
  SelectPolicyAction,
  SubmitPolicyAction
} from "state-management/actions/policies.actions";
// import * as selectors from 'state-management/selectors';
import {
  getPolicies,
  getPolicyState,
  getSelectedPolicies
} from "state-management/selectors/policies.selectors";
import { PoliciesService } from "../policies.service";
// import { DialogComponent } from 'shared/modules/dialog/dialog.component';
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
  selector: "archive-settings",
  templateUrl: "./archive-settings.component.html",
  styleUrls: ["./archive-settings.component.scss"]
})
export class ArchiveSettingsComponent implements OnInit {
  public selectedPolicies: Policy[] = [];
  public pageSizeOptions: number[] = [30, 1000];
  public editFields = {
    select: "",
    manager: "",
    ownerGroup: "",
    "auto archive": "",
    "archive delay": "",
    "number of copies on tape": "",
    "notification email": ""
  };
  public editEnabled = true;
  public dataSource: MatTableDataSource<any> | null;
  @Input()
  public totalNumber: number = 0;
  @Input()
  public currentPage: number = 0;
  @Input()
  public showSelect: boolean = false;
  @Input()
  public disabledColumns: string[] = [];
  public policies$ = this.store.pipe(select(getPolicies));
  private policyState$ = this.store.pipe(select(getPolicyState));
  private selectedPolicies$ = this.store.pipe(select(getSelectedPolicies));
  private policies: Policy[] = [];
  private subscriptions: any;
  private displayedColumns: string[] = [
    "select",
    "manager",
    "ownerGroup",
    "auto archive",
    "archive delay",
    "number of copies on tape",
    "notification email"
  ];
  @Output()
  private onClick: EventEmitter<Policy> = new EventEmitter();
  // @Output() private onDeselect: EventEmitter<Policy> = new EventEmitter();
  @Output()
  private onSortChange: EventEmitter<SortChangeEvent> = new EventEmitter();

  // @Output() private onSelect: EventEmitter<Policy> = new EventEmitter();

  constructor(
    private actionsSubj: ActionsSubject,
    private store: Store<Policy>,
    private router: Router,
    private route: ActivatedRoute,
    private policiesService: PoliciesService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.store.dispatch(new FetchPoliciesAction());
    console.log("policyState$:", this.policyState$);

    this.policiesService.getPolicies().subscribe(data => {
      this.policies = data as Policy[];
    });

    this.store.pipe(select(getSelectedPolicies)).subscribe(data => {
      this.selectedPolicies = data as Policy[];
    });

    this.subscriptions = this.actionsSubj.subscribe(data => {
      if (data.type === "[Policy] Submit policy settings complete") {
        this.store.dispatch(new FetchPoliciesAction());
      }
    });
  }

  public getDisplayedColumns(): string[] {
    return this.displayedColumns.filter(
      column => this.disabledColumns.indexOf(column) === -1
    );
  }

  public handleSortChange(event: SortChangeEvent): void {
    this.onSortChange.emit(event);
  }

  /*
    private onClose(result: any) {
      if (result) {
        for (let policy of this.selectedPolicies) {
          policy.autoArchive = result.autoArchive;
          this.store.dispatch(new SubmitPolicyAction(policy));
        }
      }
    }

  */

  onSelect(policy: Policy): void {
    this.store.dispatch(new SelectPolicyAction(policy));
  }

  onDeselect(policy: Policy): void {
    this.store.dispatch(new DeselectPolicyAction(policy));
  }

  private openDialog() {
    console.log("selected: ", this.selectedPolicies);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass;
    dialogConfig.direction = "rtl";

    dialogConfig.data = this.selectedPolicies;

    const dialogRef = this.dialog.open(EditDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(val => this.onClose(val));
  }

  private onClose(result: any) {
    if (result) {
      var selected = [];
      //deep copy
      selected = JSON.parse(JSON.stringify(this.selectedPolicies));
      console.log("1: ", selected);
      for (let policy of selected) {
        policy.autoArchive = result.autoArchive;
        console.log("2: ", policy);
        this.store.dispatch(new SubmitPolicyAction(policy));
      }
    }
  }

  private handleClick(policy): void {
    this.onClick.emit(policy);
  }

  private handleSelect(event: MatCheckboxChange, policy: Policy): void {
    console.log("handleSelect!!");
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
