import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatCheckboxChange, MatDialog, MatDialogConfig, MatPaginator } from "@angular/material";
import { Policy } from "state-management/models";

import { ActivatedRoute, Router } from "@angular/router";
import { ActionsSubject, select, Store } from "@ngrx/store";

import {
  ChangePageAction,
  ClearSelectionAction,
  DeselectPolicyAction,
  FetchPoliciesAction,
  SelectPolicyAction,
  SortByColumnAction,
  SubmitPolicyAction
} from "state-management/actions/policies.actions";
import { getPage, getPolicies, getPolicyState, getSelectedPolicies, getTotalCount } from "state-management/selectors/policies.selectors";
import { PoliciesService } from "../policies.service";
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
  public policies$ = this.store.pipe(select(getPolicies));
  dialogConfig: MatDialogConfig;
  /*@Input()
  public totalNumber: number = 0;
  @Input()

  @Input()
  public showSelect: boolean = false;
  @Input()*/
  public currentPage: number = 0;
  public disabledColumns: string[] = [];
  public pageSizeOptions: number[] = [30, 1000];
  public editEnabled = true;
  public policiesPerPage = 10;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  private policyState$ = this.store.pipe(select(getPolicyState));
  private selectedPolicies$ = this.store.pipe(select(getSelectedPolicies));
  private currentPage$ = this.store.pipe(select(getPage));
  private policyCount$ = this.store.select(getTotalCount);
  private selectedPolicies: Policy[] = [];
  private selectedGroups: string[] = [];
  private selectedIds: string[] = [];
  private multiSelect: boolean = false;
  private policies: Policy[] = [];
  private subscriptions: any;
  @Output()
  private onClick: EventEmitter<Policy> = new EventEmitter();
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

  constructor(
    private actionsSubj: ActionsSubject,
    private store: Store<Policy>,
    private router: Router,
    private route: ActivatedRoute,
    private policiesService: PoliciesService,
    public dialog: MatDialog
  ) {
  }

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

  public getDisplayedColumns(): string[] {
    return this.displayedColumns.filter(
      column => this.disabledColumns.indexOf(column) === -1
    );
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(new ChangePageAction(event.pageIndex, event.pageSize));
  }

  onSortChange(event: SortChangeEvent): void {
    const { active: column, direction } = event;
    this.store.dispatch(new SortByColumnAction(column, direction));
  //  this.store.dispatch(new FetchPoliciesAction());
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
    this.dialogConfig.panelClass;
    this.dialogConfig.direction = "ltr";
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
    if (result) {
      if (
        result.archiveEmailsToBeNotified &&
        typeof result.archiveEmailsToBeNotified === "string"
      )
        result.archiveEmailsToBeNotified = Array.from(
          result.archiveEmailsToBeNotified.split(",")
        );
      if (
        result.retrieveEmailsToBeNotified &&
        typeof result.retrieveEmailsToBeNotified === "string"
      )
        result.retrieveEmailsToBeNotified = Array.from(
          result.retrieveEmailsToBeNotified.split(",")
        );
      //var template = { id: "", ...result };
      var template = { ...result };
      //"{\"where\":{\"or\":";
      /*var idField = "{\"or\":";
      var idList = [];
      var whereId = "";

      for (var id of this.selectedIds) {
        whereId = "{\"id\":\""+ id + "\"}"
        idList.push(whereId);
        //this.store.dispatch(new SubmitPolicyAction(template));
      }
      idField += "[" + idList.join() + "]}";
      template = "";
      var submission = {
        where: JSON.parse(idField),
        data: template
      }
      //template["id"] = this.selectedIds;*/

      var idList = [];
      var whereId = "";
      /*for (var id of this.selectedIds) {
        whereId = "{\"id\":\""+ id + "\"}"
        idList.push(whereId);
        //this.store.dispatch(new SubmitPolicyAction(template));
      }*/
      //var where = "id:" + this.selectedIds[0] ;
      //var where = "{id:\""+ this.selectedIds[0] + "\"}";
      var where =  "%7B%22id%22%3A%20%225b7d31c496f3ea542d9f67be%22%7";
      var data = template;
      var submission = {
        //where: JSON.parse(idList.join()),
        where:  where,
        data: template
      }
      console.log("where: ", where)
      //{"where":{"or":[{"id":1},{"id":2},...,{"id":20"},{"id":21}]}}
      this.store.dispatch(new SubmitPolicyAction(submission));

      this.store.dispatch(new ClearSelectionAction());

    }
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

  private onEditClick() {
    this.openDialog();
  }

}
