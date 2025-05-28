import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { fromEvent, Subscription } from "rxjs";
import {
  fetchInstrumentAction,
  saveCustomMetadataAction,
} from "state-management/actions/instruments.actions";
import { selectCurrentInstrument } from "state-management/selectors/instruments.selectors";
import { EditableComponent } from "app-routing/pending-changes.guard";
import { AppConfigService } from "app-config.service";
import { selectIsAdmin } from "state-management/selectors/user.selectors";

@Component({
  selector: "app-instrument-details",
  templateUrl: "./instrument-details.component.html",
  styleUrls: ["./instrument-details.component.scss"],
  standalone: false,
})
export class InstrumentDetailsComponent
  implements OnInit, OnDestroy, EditableComponent
{
  private _hasUnsavedChanges = false;

  instrument$ = this.store.select(selectCurrentInstrument);
  isAdmin$ = this.store.select(selectIsAdmin);
  appConfig = this.appConfigService.getConfig();
  subscriptions: Subscription[] = [];

  constructor(
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
    private store: Store,
  ) {}

  onSaveCustomMetadata(
    pid: string,
    customMetadata: Record<string, unknown>,
  ): void {
    this.store.dispatch(saveCustomMetadataAction({ pid, customMetadata }));
  }

  ngOnInit() {
    const pid = this.route.snapshot.paramMap.get("id") ?? "";
    this.store.dispatch(fetchInstrumentAction({ pid }));

    // Prevent user from reloading page if there are unsaved changes
    this.subscriptions.push(
      fromEvent(window, "beforeunload").subscribe((event) => {
        if (this.hasUnsavedChanges()) {
          event.preventDefault();
        }
      }),
    );
  }

  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }
  onHasUnsavedChanges($event: boolean) {
    this._hasUnsavedChanges = $event;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
