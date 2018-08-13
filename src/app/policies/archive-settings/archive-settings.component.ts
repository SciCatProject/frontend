import { Component, Input, Output, EventEmitter } from '@angular/core';

import {
  OnInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { Policy } from 'state-management/models';

import { Router, ActivatedRoute, } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { SharedCatanieModule } from 'shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { Store, select } from '@ngrx/store';
import { policiesReducer } from 'state-management/reducers/policies.reducer';
//import { Observable } from 'rxjs/Observable';
import {

  FetchPoliciesAction,
  FetchPoliciesCompleteAction,
  SelectPolicyAction,
  DeselectPolicyAction,
  SubmitPolicyAction,
  SubmitPolicyCompleteAction

} from 'state-management/actions/policies.actions';
//import * as selectors from 'state-management/selectors';
import { getPolicies, getPolicyState, getSelectedPolicies } from 'state-management/selectors/policies.selectors';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { PoliciesService } from '../policies.service';
import { ConfigFormComponent } from 'shared/modules/config-form/config-form.component';
//import { DialogComponent } from 'shared/modules/dialog/dialog.component';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface SortChangeEvent {
  active: keyof Policy;
  direction: 'asc' | 'desc' | '';
}

@Component({
  selector: 'archive-settings',
  templateUrl: './archive-settings.component.html',
  styleUrls: ['./archive-settings.component.scss'],

})


export class ArchiveSettingsComponent implements OnInit {

  private policies$ = this.store.pipe(select(getPolicies));
  private policyState$ = this.store.pipe(select(getPolicyState));
  private selectedPolicies$ = this.store.pipe(select(getSelectedPolicies));
  public selectedPolicies: Policy[] = [];
  private policies: Policy[] = [];

  constructor(
    private store: Store<Policy>,
    private router: Router,
    private route: ActivatedRoute,
    private policiesService: PoliciesService,
    public dialog: MatDialog,
  ) { }

  subscriptions = [];
  dataSource: MatTableDataSource<any> | null;



  @Input() public totalNumber: number = 0;
  @Input() public currentPage: number = 0;

  @Input() public showSelect: boolean = false;

  @Input() public disabledColumns: string[] = [];

  @Output() private onClick: EventEmitter<Policy> = new EventEmitter();
  //@Output() private onSelect: EventEmitter<Policy> = new EventEmitter();
  //@Output() private onDeselect: EventEmitter<Policy> = new EventEmitter();
  @Output() private onSortChange: EventEmitter<SortChangeEvent> = new EventEmitter();

  private pageSizeOptions: number[] = [30, 1000];
  private displayedColumns: string[] = [
    'select',
    'manager',
    'ownerGroup',
    'auto archive',
    'archive delay',
    'number of copies on tape',
    'notification email'
  ];

  editFields = {
    'select': "",
    'manager': "",
    'ownerGroup': "",
    'auto archive': "",
    'archive delay': "",
    'number of copies on tape': "",
    'notification email': ""
  };




  private editEnabled = true;

  ngOnInit() {
    //var policyState$ = this.store.pipe(select(getPolicyState));
    //console.log("policyState$: ", policyState$);
    this.store.dispatch(new FetchPoliciesAction());
    console.log("policyState$:", this.policyState$);

    this.policiesService.getPolicies()
      .subscribe(data => {
        this.policies = data as Policy[];

      })

    this.store.pipe(select(getSelectedPolicies))
      .subscribe(data => {
        this.selectedPolicies = data as Policy[];

      });




  };

  private openDialog() {

    console.log("selected: ", this.selectedPolicies);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass;
    dialogConfig.direction = "rtl";

    dialogConfig.data = this.selectedPolicies;

    const dialogRef = this.dialog.open(EditDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      val => this.onClose(val)
    );
  }


  private onClose(result: any) {
    if (result) {
      for (let policy of this.selectedPolicies) {
        policy.autoArchive = result.autoArchive;
        this.store.dispatch(new SubmitPolicyAction(policy));
      }
    }
  }


  /*  if (result) {
      console.log("val: ", result);
      this.store.dispatch(new SubmitPolicyAction(result));*/

  private getDisplayedColumns(): string[] {

    return this.displayedColumns.filter(column => this.disabledColumns.indexOf(column) === -1);
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
    return !!this.selectedPolicies.find(selectedPolicy => selectedPolicy.id === policy.id);
  }

  private allAreSelected(): boolean {
    return this.policies.length > 0 && this.selectedPolicies.length === this.policies.length;
  }

  private handleSelectAll(event: MatCheckboxChange): void {
    this.policies.forEach(policy => this.handleSelect(event, policy));
  }

  private handleSortChange(event: SortChangeEvent): void {
    this.onSortChange.emit(event);
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
