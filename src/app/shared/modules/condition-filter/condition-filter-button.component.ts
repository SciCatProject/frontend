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
import { ConditionKeySource } from "./condition-filter.keys";
import { ConditionFilterService } from "./condition-filter.service";
import {
  ConditionFilterDialogComponent,
  ConditionFilterDialogData,
  dialogWidth,
  needsWideDialog,
} from "./condition-filter-dialog.component";
import { getActiveConfigs, toActiveConditions } from "./condition-filter.utils";

/** "Advanced search" button, it owns the saved filters and opens the dialog. */
@Component({
  selector: "condition-filter-button",
  templateUrl: "./condition-filter-button.component.html",
  styleUrls: ["./condition-filter-button.component.scss"],
  standalone: false,
})
export class ConditionFilterButtonComponent implements OnInit {
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
    private conditionFilterService: ConditionFilterService,
  ) {}

  private save(configs: ConditionConfig[]): void {
    this.draft.set(null);
    this.conditionFilterService.save(this.scope, configs);
    this.conditionsApplied.emit(toActiveConditions(configs));
  }

  private withSaved(use: (configs: ConditionConfig[]) => void): void {
    this.configs$.pipe(take(1)).subscribe(use);
  }

  ngOnInit(): void {
    this.configs$ = this.store.select(selectConditions(this.scope));
  }

  /** Opens the dialog, with the edits that were not applied if there are any. */
  open(configs: ConditionConfig[], highlight?: ConditionConfig): void {
    const draft = this.draft();
    // the position of a saved filter is not the one in edits
    const highlightIndex = draft ? -1 : configs.indexOf(highlight);

    this.isOpen.set(true);
    this.dialog
      .open<
        ConditionFilterDialogComponent,
        ConditionFilterDialogData,
        ConditionConfig[]
      >(ConditionFilterDialogComponent, {
        data: {
          scope: this.scope,
          configs: draft ?? configs,
          highlightIndex,
          draftChange: (edits) => this.draft.set(edits),
          keySource: this.keySource,
          unitsEnabled: this.unitsEnabled,
        },
        width: dialogWidth(needsWideDialog(draft ?? configs)),
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
      this.save(configs.filter((config) => config !== removed)),
    );
  }

  clearFilters(): void {
    this.save([]);
  }
}
