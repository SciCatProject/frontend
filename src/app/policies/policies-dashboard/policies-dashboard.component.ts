import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Policy, DatasetApi } from "shared/sdk";
import { Observable, Subscription } from "rxjs";
import {
  TableColumn,
  PageChangeEvent,
  SortChangeEvent,
  CheckboxEvent
} from "shared/modules/table/table.component";
import {
  getPoliciesPerPage,
  getPage,
  getPoliciesCount,
  getPolicies,
  getEditablePolicies,
  getSelectedPolicies,
  getEditablePoliciesCount,
  getEditablePoliciesPerPage,
  getEditablePage,
  getFilters,
  getEditableFilters
} from "state-management/selectors/policies.selectors";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { MatTabChangeEvent } from "@angular/material/tabs";
import {
  changePageAction,
  sortByColumnAction,
  selectPolicyAction,
  deselectPolicyAction,
  submitPolicyAction,
  clearSelectionAction,
  fetchPoliciesAction,
  selectAllPoliciesAction,
  changeEditablePageAction,
  sortEditableByColumnAction
} from "state-management/actions/policies.actions";
import { EditDialogComponent } from "policies/edit-dialog/edit-dialog.component";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import * as rison from "rison";
import { GenericFilters } from "state-management/models";

@Component({
  selector: "app-policies-dashboard",
  templateUrl: "./policies-dashboard.component.html",
  styleUrls: ["./policies-dashboard.component.scss"]
})
export class PoliciesDashboardComponent implements OnInit, OnDestroy {
  policies$: Observable<Policy[]> = this.store.pipe(select(getPolicies));
  policiesPerPage$: Observable<number> = this.store.pipe(
    select(getPoliciesPerPage)
  );
  currentPage$: Observable<number> = this.store.pipe(select(getPage));
  policyCount$: Observable<number> = this.store.pipe(select(getPoliciesCount));

  editablePolicies$: Observable<Policy[]> = this.store.pipe(
    select(getEditablePolicies)
  );
  editablePoliciesPerPage$: Observable<number> = this.store.pipe(
    select(getEditablePoliciesPerPage)
  );
  currentEditablePage$: Observable<number> = this.store.pipe(
    select(getEditablePage)
  );
  editableCount$: Observable<number> = this.store.pipe(
    select(getEditablePoliciesCount)
  );

  multiSelect = false;
  selectedIds: string[] = [];
  selectedGroups: string[] = [];
  selectedPolicies: Policy[] = [];
  selectedPoliciesSubscription: Subscription;

  dialogConfig: MatDialogConfig;

  editEnabled = true;
  paginate = true;
  tableColumns: TableColumn[] = [
    { name: "manager", icon: "account_box", sort: true, inList: true },
    { name: "ownerGroup", icon: "people", sort: true, inList: true },
    { name: "autoArchive", icon: "archive", sort: true, inList: true },
    { name: "autoArchiveDelay", icon: "timer", sort: true, inList: true },
    { name: "tapeRedundancy", icon: "voicemail", sort: true, inList: true },
    {
      name: "archiveEmailNotification",
      icon: "email",
      sort: true,
      inList: true
    },
    {
      name: "archiveEmailsToBeNotified",
      icon: "playlist_add",
      sort: true,
      inList: true
    },
    {
      name: "retrieveEmailNotification",
      icon: "email",
      sort: true,
      inList: true
    },
    {
      name: "retrieveEmailsToBeNotified",
      icon: "playlist_add",
      sort: true,
      inList: true
    }
  ];

  constructor(
    private datasetApi: DatasetApi,
    public dialog: MatDialog,
    private router: Router,
    private store: Store<Policy>
  ) {}

  onTabChange(event: MatTabChangeEvent) {
    console.log("Click!", event);
    switch (event.index) {
      case 0: {
        this.updatePoliciesRouterState();
        break;
      }
      case 1: {
        this.updateEditableRouterState();
        break;
      }
      default: {
        break;
      }
    }
  }

  updatePoliciesRouterState() {
    this.store
      .pipe(select(getFilters))
      .subscribe(filters => {
        if (filters) {
          this.addToQueryParams(filters);
        }
      })
      .unsubscribe();
  }

  updateEditableRouterState() {
    this.store
      .pipe(select(getEditableFilters))
      .subscribe(filters => {
        if (filters) {
          this.addToQueryParams(filters);
        }
      })
      .unsubscribe();
  }

  addToQueryParams(filters: GenericFilters) {
    this.router.navigate(["/policies"], {
      queryParams: { args: rison.encode(filters) }
    });
  }

  onPoliciesPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize })
    );
    this.updatePoliciesRouterState();
  }

  onEditablePoliciesPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changeEditablePageAction({ page: event.pageIndex, limit: event.pageSize })
    );
    this.updateEditableRouterState();
  }

  onPoliciesSortChange(event: SortChangeEvent) {
    this.store.dispatch(
      sortByColumnAction({ column: event.active, direction: event.direction })
    );
    this.updatePoliciesRouterState();
  }

  onEditablePoliciesSortChange(event: SortChangeEvent) {
    this.store.dispatch(
      sortEditableByColumnAction({
        column: event.active,
        direction: event.direction
      })
    );
    this.updateEditableRouterState();
  }

  onSelectAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.store.dispatch(selectAllPoliciesAction());
    } else {
      this.store.dispatch(clearSelectionAction());
    }
  }

  onSelectOne(checkboxEvent: CheckboxEvent) {
    const { event, row } = checkboxEvent;
    if (event.checked) {
      this.store.dispatch(selectPolicyAction({ policy: row }));
    } else {
      this.store.dispatch(deselectPolicyAction({ policy: row }));
    }
  }

  openDialog() {
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.direction = "ltr";
    this.dialogConfig.data = {
      selectedPolicy: this.selectedPolicies[0],
      selectedGroups: this.selectedGroups,
      multiSelect: this.multiSelect
    };
    const dialogRef = this.dialog.open(EditDialogComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(val => this.onDialogClose(val));
  }

  onDialogClose(result: any) {
    if (result) {
      this.store.dispatch(
        submitPolicyAction({ ownerList: this.selectedGroups, policy: result })
      );
      // if datasets already exist
      this.selectedGroups.forEach(group => {
        this.datasetApi
          .count({ ownerGroup: group })
          .pipe(
            map(count => {
              if (count) {
                // if theres already some datasets for this ask to do stuff. It doesnt matter if they have alredy
                // been archived, the archiving job creator should check that
                // apply settings (trigger jobs? Archive this, notify them, )
                if (
                  confirm(
                    "Apply group " +
                      group +
                      " policy settings to existing datasets?"
                  )
                ) {
                }
                console.log("count", count);
              }
              return null;
            })
          )
          .subscribe();
        this.store.dispatch(clearSelectionAction());
      });
    }
  }

  ngOnInit() {
    this.store.dispatch(clearSelectionAction());
    this.store.dispatch(fetchPoliciesAction());

    this.selectedPoliciesSubscription = this.store
      .pipe(select(getSelectedPolicies))
      .subscribe(selectedPolicies => {
        if (selectedPolicies) {
          this.selectedPolicies = selectedPolicies;
          this.multiSelect = this.selectedPolicies.length > 1;
          this.selectedGroups = [];
          this.selectedIds = [];

          selectedPolicies.forEach(policy => {
            this.selectedGroups.push(policy.ownerGroup);
            this.selectedIds.push(policy.id);
          });
        }
      });

    this.updatePoliciesRouterState();
  }

  ngOnDestroy() {
    this.selectedPoliciesSubscription.unsubscribe();
  }
}
