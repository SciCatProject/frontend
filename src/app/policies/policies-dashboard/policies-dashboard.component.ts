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
  getItemsPerPage,
  getPage,
  getTotalCount,
  getPolicies,
  getEditablePolicies,
  getSelectedPolicies,
  getEditableCount
} from "state-management/selectors/policies.selectors";
import {
  MatCheckboxChange,
  MatDialogConfig,
  MatDialog
} from "@angular/material";
import {
  ChangePageAction,
  SortByColumnAction,
  SelectPolicyAction,
  DeselectPolicyAction,
  SubmitPolicyAction,
  ClearSelectionAction,
  FetchPoliciesAction
} from "state-management/actions/policies.actions";
import { EditDialogComponent } from "policies/edit-dialog/edit-dialog.component";
import { map } from "rxjs/operators";

@Component({
  selector: "app-policies-dashboard",
  templateUrl: "./policies-dashboard.component.html",
  styleUrls: ["./policies-dashboard.component.scss"]
})
export class PoliciesDashboardComponent implements OnInit, OnDestroy {
  constructor(
    private datasetApi: DatasetApi,
    public dialog: MatDialog,
    private store: Store<Policy>
  ) {}

  policies$: Observable<Policy[]> = this.store.pipe(select(getPolicies));
  editablePolicies$: Observable<Policy[]> = this.store.pipe(
    select(getEditablePolicies)
  );
  itemsPerPage$: Observable<number> = this.store.pipe(select(getItemsPerPage));
  currentPage$: Observable<number> = this.store.pipe(select(getPage));
  policyCount$: Observable<number> = this.store.pipe(select(getTotalCount));
  editableCount$: Observable<number> = this.store.pipe(
    select(getEditableCount)
  );

  multiSelect: boolean = false;
  selectedIds: string[] = [];
  selectedGroups: string[] = [];
  selectedPolicies: Policy[] = [];
  selectedPoliciesSubscription: Subscription;

  dialogConfig: MatDialogConfig;

  editEnabled: boolean = true;
  paginate: boolean = true;
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

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(new ChangePageAction(event.pageIndex, event.pageSize));
  }

  onSortChange(event: SortChangeEvent) {
    this.store.dispatch(new SortByColumnAction(event.active, event.direction));
  }

  onSelectAll(event: MatCheckboxChange) {
    this.policies$
      .subscribe(policies => {
        policies.forEach(policy => {
          this.onSelectOne({ event, row: policy });
        });
      })
      .unsubscribe();
  }

  onSelectOne(checkboxEvent: CheckboxEvent) {
    const { event, row } = checkboxEvent;
    if (event.checked) {
      this.store.dispatch(new SelectPolicyAction(row));
    } else {
      this.store.dispatch(new DeselectPolicyAction(row));
    }
  }

  onRowClick(policy: Policy) {}

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
      this.store.dispatch(new SubmitPolicyAction(this.selectedGroups, result));
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
      });
    }
    this.store.dispatch(new ClearSelectionAction());
  }

  ngOnInit() {
    this.store.dispatch(new ClearSelectionAction());
    this.store.dispatch(new FetchPoliciesAction());

    this.selectedPoliciesSubscription = this.store
      .pipe(select(getSelectedPolicies))
      .subscribe(selectedPolicies => {
        if (selectedPolicies) {
          this.selectedPolicies = selectedPolicies;
          this.multiSelect = this.selectedPolicies.length > 1;

          selectedPolicies.forEach(policy => {
            this.selectedGroups.push(policy.ownerGroup);
            this.selectedIds.push(policy.id);
          });
        }
      });
  }

  ngOnDestroy() {
    this.selectedPoliciesSubscription.unsubscribe();
  }
}
