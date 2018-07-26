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
import { Observable } from 'rxjs/Observable';
import {

  FetchPoliciesAction,
  FetchPoliciesCompleteAction

} from 'state-management/actions/policies.actions';
//import * as selectors from 'state-management/selectors';
import { getPolicies } from 'state-management/selectors/policies.selectors';
import { MatTableDataSource, MatPaginator } from '@angular/material';
//import { getPolicies } from './policies.service';

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

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  //@Input() policies: Policy[];
  subscriptions = [];
  dataSource: MatTableDataSource<any> | null;

  //public policies: Policy[] = [];

  @Input() public selectedSets: Policy[] = [];
  @Input() public totalNumber: number = 0;
  @Input() public currentPage: number = 0;
  //@Input() public datasetsPerPage: number = 30;
  @Input() public showSelect: boolean = false;
  //@Input() public rowClassifier?: (dataset: Policy) => string;
  @Input() public disabledColumns: string[] = [];

  @Output() private onClick: EventEmitter<Policy> = new EventEmitter();
  @Output() private onSelect: EventEmitter<Policy> = new EventEmitter();
  @Output() private onDeselect: EventEmitter<Policy> = new EventEmitter();
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

  ngOnInit() {
    console.log("here! ngOnInit");

    //this.dataSource = new MatTableDataSource(this.policies$);

  /*  this.store.pipe(select(getPolicies)).subscribe(arr => {
          console.log("fromStore.getAllPol: " + arr);
          this.policies = arr;

          this.dataSource = new MatTableDataSource(
            this.policies
          );

        });*/

    //this.store.dispatch(new FetchPoliciesAction());
    //this.store.dispatch(new FetchPoliciesCompleteAction(this.policies));
    console.log("policies:", this.policies$);
    //this.policies = this.policies$;

    //this.policies = this.policies$.data;
    //

/*    this.store.select(getPolicies);
    console.log("selectors: ", getPolicies);
    //console.log("selectors: ", this.policies["manager"]);
    //this.dataSource = new MatTableDataSource(this.policies);
    this.subscriptions.push(this.store.select(getPolicies)
      .subscribe(selected => {

        this.policies = selected.slice();
        //this.dataSource = new MatTableDataSource(this.policies);
        //console.log("here2:", this.policies);

      }));
*/

  };

  private getDisplayedColumns(): string[] {

    return this.displayedColumns.filter(column => this.disabledColumns.indexOf(column) === -1);
  }

  private handleClick(policy): void {

    this.onClick.emit(policy);
  }

  private handleSelect(event: MatCheckboxChange, policy: Policy): void {
    if (event.checked) {
      this.onSelect.emit(policy);
    } else {
      this.onDeselect.emit(policy);
    }
  }

  /*private handleSelectAll(event: MatCheckboxChange): void {
    this.policies$.forEach(policy => this.handleSelect(event, policy));
  }*/

  private handleSortChange(event: SortChangeEvent): void {
    console.log("on click");
    this.store.dispatch(new FetchPoliciesAction());
    console.log("here2:", this.policies$);
    //this.store.dispatch(new FetchPoliciesCompleteAction(this.policies));
    this.onSortChange.emit(event);
  }
}
