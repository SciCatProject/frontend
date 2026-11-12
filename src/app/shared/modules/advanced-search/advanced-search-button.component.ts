import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable, take } from "rxjs";
import {
  ConditionSettingScope,
  FilterCondition,
} from "state-management/models";
import { ConditionConfig } from "state-management/state/user.store";
import { selectConditions } from "state-management/selectors/user.selectors";
import { ConditionKeySource } from "./advanced-search.keys";
import { AdvancedSearchService } from "./advanced-search.service";
import {
  AdvancedSearchDialogComponent,
  AdvancedSearchDialogData,
  DIALOG_WIDTH,
} from "./advanced-search-dialog.component";
import {
  getActiveConfigs,
  toActiveConditions,
  withoutSwitchedOff,
} from "./advanced-search.utils";

/** "Advanced search" button, it owns the saved filters and opens the dialog. */
@Component({
  selector: "advanced-search-button",
  templateUrl: "./advanced-search-button.component.html",
  styleUrls: ["./advanced-search-button.component.scss"],
  standalone: false,
})
export class AdvancedSearchButtonComponent implements OnInit {
  @Input({ required: true }) scope: ConditionSettingScope;
  @Input({ required: true }) keySource: ConditionKeySource;
  @Input() unitsEnabled = false;
  /** Only the icon, e.g. inside a search box. */
  @Input() iconOnly = false;

  @Output() conditionsApplied = new EventEmitter<FilterCondition[]>();

  configs$: Observable<ConditionConfig[]>;
  /** True while the dialog is open. */
  readonly isOpen = signal(false);
  /** Edits that were closed without applying, they come back when the dialog opens again. */
  readonly draft = signal<ConditionConfig[] | null>(null);
  readonly getActive = getActiveConfigs;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private advancedSearchService: AdvancedSearchService,
  ) {}

  private save(configs: ConditionConfig[]): void {
    this.draft.set(null);
    this.advancedSearchService.save(this.scope, configs);
    this.conditionsApplied.emit(toActiveConditions(configs));
  }

  private withSaved(use: (configs: ConditionConfig[]) => void): void {
    this.configs$.pipe(take(1)).subscribe(use);
  }

  ngOnInit(): void {
    this.configs$ = this.store.select(selectConditions(this.scope));
  }

  /** How many saved filters wait for a value, they are not applied until they have one. */
  getWaiting(configs: ConditionConfig[]): number {
    return (
      withoutSwitchedOff(configs).length - getActiveConfigs(configs).length
    );
  }

  /**
   * Opens the dialog, with the edits that were not applied if there are any. A filter that older
   * settings switched off is left out, one that has no value yet is shown to be filled in.
   */
  open(configs: ConditionConfig[], highlight?: ConditionConfig): void {
    const draft = this.draft();
    const shown = withoutSwitchedOff(configs);
    // the position of a saved filter is not the one in edits
    const highlightIndex = draft ? -1 : shown.indexOf(highlight);

    this.isOpen.set(true);
    this.dialog
      .open<
        AdvancedSearchDialogComponent,
        AdvancedSearchDialogData,
        ConditionConfig[]
      >(AdvancedSearchDialogComponent, {
        data: {
          scope: this.scope,
          configs: draft ?? shown,
          highlightIndex,
          draftChange: (edits) => this.draft.set(edits),
          keySource: this.keySource,
          unitsEnabled: this.unitsEnabled,
        },
        width: DIALOG_WIDTH,
        maxWidth: "95vw",
        autoFocus: highlightIndex >= 0 ? false : "[data-cy=condition-field]",
      })
      .afterClosed()
      .subscribe((result) => {
        this.isOpen.set(false);
        if (result) {
          this.save(result);
        }
      });
  }

  /** Opens the dialog for a filter that was clicked, e.g. on its chip. */
  openFilter(filter: ConditionConfig): void {
    this.withSaved((configs) => this.open(configs, filter));
  }

  removeFilter(removed: ConditionConfig): void {
    this.withSaved((configs) =>
      this.save(
        withoutSwitchedOff(configs).filter((config) => config !== removed),
      ),
    );
  }

  clearFilters(): void {
    this.save([]);
  }
}
