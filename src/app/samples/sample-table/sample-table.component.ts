import { Component, OnDestroy, OnInit } from "@angular/core";
import { FetchSampleAction, FetchSamplesAction, SampleSortByColumnAction } from "../../state-management/actions/samples.actions";
import { Router } from "@angular/router";
import { Sample } from "../../shared/sdk/models";
import { getSamplesList } from "state-management/selectors/samples.selectors";
import { select, Store } from "@ngrx/store";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { SampleDialogComponent } from "../sample-dialog/sample-dialog.component";



export interface SortChangeEvent {
  active: keyof Sample;
  direction: "asc" | "desc" | "";
}

@Component({
  selector: "app-sample-table",
  templateUrl: "./sample-table.component.html",
  styleUrls: ["./sample-table.component.css"]
})
export class SampleTableComponent implements OnInit, OnDestroy {
  public samples$ = this.store.pipe(select(getSamplesList));
  samples: Sample[] = [];
  displayedColumns = ["samplelId", "owner", "createdAt", "description"];
  dialogConfig: MatDialogConfig;
  description: string;
  name: string;
  private subscriptions = [];

  constructor(
    private store: Store<Sample>,
    private router: Router,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new FetchSamplesAction());

    this.subscriptions.push(
      this.samples$.subscribe(data2 => {
        this.samples = data2;
        // console.log(data2);
      })
    );
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  onRowSelect(event, sample) {
    this.store.dispatch(new FetchSampleAction(sample));
    this.router.navigateByUrl(
      "/samples/" + encodeURIComponent(sample.samplelId)
    );
  }

  public onEditClick() {
    this.openDialog();
  }

  private openDialog() {
    this.dialogConfig = new MatDialogConfig();
    // this.dialogConfig.disableClose = true;
    // this.dialogConfig.autoFocus = true;
    // this.dialogConfig.direction = "ltr";
    const dialogRef = this.dialog.open(SampleDialogComponent, {
      width: "250px",
      data: { name: this.name, description: this.description }
    });

  }

  onSortChange(event: SortChangeEvent): void {
    const { active: column, direction } = event;
     this.store.dispatch(new SampleSortByColumnAction(column, direction));
  }
}
