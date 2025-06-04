import { Component } from "@angular/core";
import {
  selectGroupFacetCounts,
  selectGroupFilter,
} from "state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";
import {
  addGroupFilterAction,
  removeGroupFilterAction,
} from "state-management/actions/datasets.actions";
import {
  createSuggestionObserver,
  getFacetCount,
  getFacetId,
  getFilterLabel,
} from "./utils";
import { BehaviorSubject } from "rxjs";
import { ClearableInputComponent } from "./clearable-input.component";
import { FilterComponentInterface } from "./interface/filter-component.interface";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "app-group-filter",
  templateUrl: "group-filter.component.html",
  styleUrls: ["group-filter.component.scss"],
  standalone: false,
})
export class GroupFilterComponent
  extends ClearableInputComponent
  implements FilterComponentInterface
{
  protected readonly getFacetId = getFacetId;
  protected readonly getFacetCount = getFacetCount;
  readonly componentName: string = "GroupFilter";
  readonly label: string = "Group Filter";
  readonly tooltipText: string = "Filters datasets by group";

  appConfig = this.appConfigService.getConfig();

  groupFilter$ = this.store.select(selectGroupFilter);

  groupFacetCounts$ = this.store.select(selectGroupFacetCounts);
  groupInput$ = new BehaviorSubject<string>("");

  groupSuggestions$ = createSuggestionObserver(
    this.groupFacetCounts$,
    this.groupInput$,
    this.groupFilter$,
  );

  constructor(
    private store: Store,
    private appConfigService: AppConfigService,
  ) {
    super();

    const filters = this.appConfig.labelMaps?.filters;
    this.label = getFilterLabel(filters, this.componentName, this.label);
  }

  onGroupInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.groupInput$.next(value);
  }
  groupSelected(group: string) {
    this.store.dispatch(addGroupFilterAction({ group }));
    this.groupInput$.next("");
  }

  groupRemoved(group: string) {
    this.store.dispatch(removeGroupFilterAction({ group }));
  }
}
