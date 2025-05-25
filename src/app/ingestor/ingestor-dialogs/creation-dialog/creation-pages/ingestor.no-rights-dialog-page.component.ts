import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  IngestionRequestInformation,
  IngestorHelper,
} from "../../../ingestor-page/helper/ingestor.component-helper";
import { Store } from "@ngrx/store";
import { selectIngestionObject } from "state-management/selectors/ingestor.selector";
import { Subscription } from "rxjs";

@Component({
  selector: "ingestor-no-rights-dialog-page",
  templateUrl: "ingestor.no-rights-dialog-page.html",
  styleUrls: ["../../../ingestor-page/ingestor.component.scss"],
  standalone: false,
})
export class IngestorNoRightsDialogPageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  readonly dialog = inject(MatDialog);

  ingestionObject$ = this.store.select(selectIngestionObject);

  @Output() nextStep = new EventEmitter<void>();

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  constructor(private store: Store) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ingestionObject$.subscribe((ingestionObject) => {
        if (ingestionObject) {
          this.createNewTransferData = ingestionObject;
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  onClickNext(): void {
    this.nextStep.emit(); // Open next dialog
  }
}
