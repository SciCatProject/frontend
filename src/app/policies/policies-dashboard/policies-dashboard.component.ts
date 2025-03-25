import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { DatasetsService, Policy } from "@scicatproject/scicat-sdk-ts-angular";
import {
  TableColumn,
  PageChangeEvent,
  SortChangeEvent,
  CheckboxEvent,
} from "shared/modules/table/table.component";
import { selectPoliciesDashboardPageViewModel } from "state-management/selectors/policies.selectors";
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
  sortEditableByColumnAction,
} from "state-management/actions/policies.actions";
import { EditDialogComponent } from "policies/edit-dialog/edit-dialog.component";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { GenericFilters } from "state-management/models";

@Component({
  selector: "app-policies-dashboard",
  templateUrl: "./policies-dashboard.component.html",
  styleUrls: ["./policies-dashboard.component.scss"],
})
export class PoliciesDashboardComponent implements OnInit {
  vm$ = this.store.select(selectPoliciesDashboardPageViewModel);

  selectedGroups: string[] = [];
  dialogConfig: MatDialogConfig = new MatDialogConfig();

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
      inList: true,
    },
    {
      name: "archiveEmailsToBeNotified",
      icon: "playlist_add",
      sort: true,
      inList: true,
    },
    {
      name: "retrieveEmailNotification",
      icon: "email",
      sort: true,
      inList: true,
    },
    {
      name: "retrieveEmailsToBeNotified",
      icon: "playlist_add",
      sort: true,
      inList: true,
    },
  ];

  constructor(
    private datasetService: DatasetsService,
    public dialog: MatDialog,
    private router: Router,
    private store: Store,
  ) {}

  onTabChange(event: MatTabChangeEvent) {
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
    this.vm$
      .subscribe((vm) => {
        if (vm.filters) {
          this.addToQueryParams(vm.filters);
        }
      })
      .unsubscribe();
  }

  updateEditableRouterState() {
    this.vm$
      .subscribe((vm) => {
        if (vm.editableFilters) {
          this.addToQueryParams(vm.editableFilters);
        }
      })
      .unsubscribe();
  }

  addToQueryParams(filters: GenericFilters) {
    this.router.navigate(["/policies"], {
      queryParams: { args: JSON.stringify(filters) },
    });
  }

  onPoliciesPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize }),
    );
    this.updatePoliciesRouterState();
  }

  onEditablePoliciesPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changeEditablePageAction({
        page: event.pageIndex,
        limit: event.pageSize,
      }),
    );
    this.updateEditableRouterState();
  }

  onPoliciesSortChange(event: SortChangeEvent) {
    this.store.dispatch(
      sortByColumnAction({ column: event.active, direction: event.direction }),
    );
    this.updatePoliciesRouterState();
  }

  onEditablePoliciesSortChange(event: SortChangeEvent) {
    this.store.dispatch(
      sortEditableByColumnAction({
        column: event.active,
        direction: event.direction,
      }),
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

  openDialog(selectedPolicies: Policy[]) {
    this.selectedGroups = selectedPolicies.map((policy) => policy.ownerGroup);
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.direction = "ltr";
    this.dialogConfig.data = {
      selectedPolicy: selectedPolicies[0],
      selectedGroups: this.selectedGroups,
      multiSelect: selectedPolicies.length > 1,
    };
    const dialogRef = this.dialog.open(EditDialogComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe((val) => this.onDialogClose(val));
  }

  onDialogClose(result: any) {
    if (result) {
      this.store.dispatch(
        submitPolicyAction({ ownerList: this.selectedGroups, policy: result }),
      );
      // if datasets already exist
      this.selectedGroups.forEach((group) => {
        this.datasetService
          .datasetsControllerCount(`{ "ownerGroup": "${group}" }`)
          .pipe(
            map((count) => {
              if (count) {
                // if theres already some datasets for this ask to do stuff. It doesnt matter if they have alredy
                // been archived, the archiving job creator should check that
                // apply settings (trigger jobs? Archive this, notify them, )
                if (
                  confirm(
                    "Apply group " +
                      group +
                      " policy settings to existing datasets?",
                  )
                ) {
                  console.log("count", count);
                }
              }
              return null;
            }),
          )
          .subscribe();
        this.store.dispatch(clearSelectionAction());
      });
    }
  }

  ngOnInit() {
    this.store.dispatch(clearSelectionAction());
    this.store.dispatch(fetchPoliciesAction());

    this.updatePoliciesRouterState();
  }
}
